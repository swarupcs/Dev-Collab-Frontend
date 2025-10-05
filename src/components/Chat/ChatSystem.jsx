import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Search, Send, RefreshCw } from 'lucide-react';
import { useGetUserChat } from '@/hooks/chat/useGetUserChat';
import { useSocket } from '@/hooks/socket/useSocket';
import { useAppStore } from '@/store';
import axiosInstance from '@/config/axiosConfig';

export default function ChatSystem({ selectedChatUser }) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: userChat, refetch: refetchUserChats } = useGetUserChat();
  const userChatDetails = userChat?.data?.chats || [];

  const socket = useSocket();
  const currentUser = useAppStore((s) => s.getCurrentUser());
  const currentUserId = currentUser?._id;

  console.log('selectedChatUser ', selectedChatUser);

  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ✅ Debug socket state
  useEffect(() => {
    console.log('🔍 ChatSystem - Socket state:', {
      exists: !!socket,
      connected: socket?.connected,
      id: socket?.id,
    });
  }, [socket]);

  // ✅ derive selected chat
  let selectedChat = userChatDetails.find(
    (chat) => chat._id === selectedChatId
  );

  // 🧠 If no existing chat but a selected user exists, create a temporary chat object
  if (!selectedChat && selectedChatUser) {
    selectedChat = {
      _id: `temp-${selectedChatUser._id}`,
      participants: [
        {
          _id: currentUserId,
          firstName: currentUser?.firstName,
          lastName: currentUser?.lastName,
          photoUrl: currentUser?.photoUrl,
        },
        selectedChatUser,
      ],
      lastMessage: null,
      isTemp: true,
    };
  }

  console.log('selectedChat', selectedChat);

  // ✅ Format backend message
  const formatMessage = useCallback(
    (msg) => ({
      id: msg._id,
      senderId: msg.senderId?._id || msg.senderId,
      message: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isMe:
        (msg.senderId?._id || msg.senderId)?.toString() ===
        currentUserId?.toString(),
    }),
    [currentUserId]
  );

  // ✅ Fetch chat history via REST (wrapped in useCallback)
  const loadMessages = useCallback(
    async (chatId) => {
      try {
        setIsLoadingMessages(true);
        const res = await axiosInstance.get(
          `/chat/${chatId}/messages?limit=50`
        );
        const messages = res.data?.data?.messages || [];
        // Sort messages by createdAt to ensure latest is at bottom
        const sortedMessages = messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setChatMessages(sortedMessages.map(formatMessage));
      } catch (error) {
        console.error('❌ Error loading messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [formatMessage]
  );

  // 👉 Auto-load chat when a user is clicked in ConnectionsManager
  useEffect(() => {
    if (!selectedChatUser) return; // nothing to do if no user clicked
    console.log('🟢 Received selectedChatUser:', selectedChatUser);

    // Find an existing chat with this user
    const targetUserId = selectedChatUser._id?.toString();
    const existingChat = userChatDetails.find((chat) =>
      chat.participants.some(
        (p) => p._id?.toString() === selectedChatUser._id?.toString()
      )
    );

    if (existingChat) {
      console.log('✅ Found existing chat, loading messages...');
      setSelectedChatId(existingChat._id);
      loadMessages(existingChat._id);
      if (existingChat._id) loadMessages(existingChat._id);
    } else {
      console.log('🆕 No existing chat found, showing empty conversation.');
      const tempChatId = `temp-${targetUserId}`;
      setSelectedChatId(tempChatId);
      setChatMessages([]);
    }
  }, [selectedChatUser, userChatDetails, loadMessages]);

  // ✅ Smart auto-scroll - only when new messages arrive or chat changes
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 100);
    }
  }, [chatMessages.length, selectedChatId]);

  // ✅ Socket listeners for receive + sent
  // 🎯 THIS IS WHERE THE MAGIC HAPPENS - loadMessages is called on receive_message
  // ✅ Socket listeners for receive + sent
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleReceive = (msg) => {
      console.log('📩 Received message:', msg);
      // ⭐ If message is for the currently selected chat, add it to the messages
      if (msg.chatId === selectedChatId) {
        const formattedMsg = formatMessage(msg);
        setChatMessages((prev) => {
          // Check if message already exists to avoid duplicates
          if (prev.some((m) => m.id === formattedMsg.id)) {
            return prev;
          }
          return [...prev, formattedMsg];
        });
      }
    };

const handleSent = (msg) => {
  console.log('✅ Message sent confirmation:', msg);

  // Replace the temporary message with the confirmed one
  setChatMessages((prev) =>
    prev.map((m) =>
      m.id.startsWith('temp-') &&
      m.message === msg.text &&
      m.senderId === currentUserId
        ? formatMessage(msg)
        : m
    )
  );

  // 🆕 If this was a brand-new chat, update the chatId and refresh chat list
  if (selectedChatId.startsWith('temp-') && msg.chatId) {
    console.log('✨ Updating chatId after first message:', msg.chatId);
    setSelectedChatId(msg.chatId);

    // Optional: refresh chat list so the new chat appears in the sidebar
    // 🧠 React Query way to refresh sidebar chat list
    refetchUserChats().then(() => {
      console.log('🔁 Chat list refetched after first message');
    });
  }
};


    const handleError = (error) => {
      console.error('❌ Socket error:', error);
    };

    socket.on('receive_message', handleReceive);
    socket.on('message_sent', handleSent);
    socket.on('error_message', handleError);

    // ✅ Cleanup listeners
    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('message_sent', handleSent);
      socket.off('error_message', handleError);
    };
  }, [socket, currentUserId, selectedChatId, formatMessage]);

  // ✅ Send message
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !selectedChatId || !socket) {
      console.log('❌ Cannot send message:', {
        hasMessage: !!trimmedMessage,
        hasChat: !!selectedChatId,
        hasSocket: !!socket,
      });
      return;
    }

    const chat =
      userChatDetails.find((c) => c._id === selectedChatId) || selectedChat;


    const receiver = chat?.participants.find((p) => p._id !== currentUserId);
    if (!receiver) {
      console.error('❌ Receiver not found');
      return;
    }

    const tempMessage = {
      id: 'temp-' + Date.now(),
      senderId: currentUserId,
      message: trimmedMessage,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isMe: true,
    };

    console.log('📤 Sending message:', {
      senderId: currentUserId,
      receiverId: receiver._id,
      text: trimmedMessage,
    });

    // Add to UI immediately
    setChatMessages((prev) => [...prev, tempMessage]);
    setMessage('');

    // Send via socket
    socket.emit('send_message', {
      senderId: currentUserId,
      receiverId: receiver._id,
      text: trimmedMessage,
      
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    loadMessages(chatId);
  };

  // ✅ Filter chats by search
  const filteredChats = userChatDetails.filter((chat) => {
    if (!searchQuery) return true;
    const other = chat.participants.find((p) => p._id !== currentUserId);
    const fullName = `${other?.firstName || ''} ${
      other?.lastName || ''
    }`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className='grid gap-6 lg:grid-cols-3 h-[600px]'>
      {/* Chat List */}
      <Card className='lg:col-span-1'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between mb-2'>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Messages
            </CardTitle>
            <Button variant='ghost' size='sm'>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search conversations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <ScrollArea className='h-[500px]'>
            {filteredChats.map((chat) => {
              const other = chat.participants.find(
                (p) => p._id !== currentUserId
              );
              return (
                <div
                  key={chat._id}
                  className={`p-3 cursor-pointer ${
                    selectedChatId === chat._id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleChatSelect(chat._id)}
                >
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={other?.photoUrl} />
                      <AvatarFallback>
                        {other?.firstName?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h4 className='font-medium'>
                        {other?.firstName || 'Unknown'}
                      </h4>
                      <p className='text-sm text-muted-foreground truncate'>
                        {/* {chat.lastMessage?.text || 'No messages yet'} */}
                      </p>
                    </div>
                    {/* {chat.unreadCount > 0 && <Badge>{chat.unreadCount}</Badge>} */}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className='lg:col-span-2'>
        {selectedChat ? (
          <>
            <CardHeader>
              {(() => {
                const other = selectedChat.participants.find(
                  (p) => p._id !== currentUserId
                );
                return (
                  `${other?.firstName || ''} ${other?.lastName || ''}`.trim() ||
                  'Chat'
                );
              })()}
            </CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[400px] p-4'>
                {isLoadingMessages ? (
                  <p className='text-center text-muted-foreground'>
                    Loading...
                  </p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex mb-4 ${
                        msg.isMe ? 'justify-end' : 'justify-start'
                      } animate-slideIn`}
                      style={{
                        animation: `slideIn 0.3s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.isMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className='break-words'>{msg.message}</p>
                        <p className='text-xs opacity-70 mt-1'>{msg.time}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              <Separator />

              <div className='p-4 flex gap-2'>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Type your message...'
                  className='min-h-[60px] max-h-[120px]'
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !socket}
                  className='self-end'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground'>
              Select a chat to start messaging
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
