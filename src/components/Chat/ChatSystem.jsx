import { useState, useRef, useEffect } from 'react';
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

export default function ChatSystem() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: userChat } = useGetUserChat();
  const userChatDetails = userChat?.data?.chats || [];

  const socket = useSocket();
  const currentUser = useAppStore((s) => s.getCurrentUser());
  const currentUserId = currentUser?._id;

  console.log("socket", socket);

  useEffect(() => {
    if (!socket) return;
    console.log('socket instance:', socket);
  }, [socket]);

  // ✅ derive selected chat
  const selectedChat = userChatDetails.find(
    (chat) => chat._id === selectedChatId
  );

  // ✅ Auto-scroll when messages or chat change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedChatId]);

  // ✅ Register user once after connect
  useEffect(() => {
    if (socket && currentUserId) {
      socket.emit('register', currentUserId);
    }
  }, [socket, currentUserId]);
  

  // ✅ Socket listeners for receive + sent
useEffect(() => {
  if (!socket || !currentUserId) return;

  const handleReceive = (msg) => {
    if (msg.chatId === selectedChatId) {
      setChatMessages((prev) => [...prev, formatMessage(msg)]);
    }
  };

  const handleSent = (msg) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id.startsWith('temp-') &&
        m.message === msg.text &&
        m.senderId === currentUserId
          ? formatMessage(msg)
          : m
      )
    );
  };

  socket.on('receive_message', handleReceive);
  socket.on('message_sent', handleSent);

  return () => {
    socket.off('receive_message', handleReceive);
    socket.off('message_sent', handleSent);
  };
}, [socket, currentUserId, selectedChatId]);


  // ✅ Format backend message
  const formatMessage = (msg) => ({
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
  });

  // ✅ Fetch chat history via REST
  const loadMessages = async (chatId) => {
    try {
      setIsLoadingMessages(true);
      const res = await axiosInstance.get(`/chat/${chatId}/messages?limit=50`);
      const messages = res.data?.data?.messages || [];
      setChatMessages(messages.map(formatMessage));
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // ✅ Send message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChatId || !socket) return;

    const tempMessage = {
      id: 'temp-' + Date.now(),
      senderId: currentUserId,
      message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, tempMessage]);
    setMessage('');

    const chat = userChatDetails.find((c) => c._id === selectedChatId);
    const receiver = chat.participants.find((p) => p._id !== currentUserId);

    // ✅ match backend
    socket.emit('send_message', {
      senderId: currentUserId,
      receiverId: receiver._id,
      text: tempMessage.message,
    });
  };

  const handleKeyPress = (e) => {
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
                        {chat.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && <Badge>{chat.unreadCount}</Badge>}
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
              {
                selectedChat.participants.find((p) => p._id !== currentUserId)
                  ?.firstName
              }
            </CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[400px] p-4'>
                {isLoadingMessages ? (
                  <p className='text-center text-muted-foreground'>
                    Loading...
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isMe ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isMe ? 'bg-primary text-white' : 'bg-muted'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <small>{msg.time}</small>
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
                  onKeyPress={handleKeyPress}
                  placeholder='Type your message...'
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className='flex items-center justify-center h-full'>
            <p>Select a chat to start messaging</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
