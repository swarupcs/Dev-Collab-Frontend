import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Code,
  Smile,
  Phone,
  Video,
  Info,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useGetUserChat } from '@/hooks/chat/useGetUserChat';
import { useSocket } from '@/hooks/socket/useSocket';
 // ✅ FIX

export default function ChatSystem() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: userChat } = useGetUserChat();
  const userChatDetails = userChat?.data?.chats || [];

  const selectedChat = userChatDetails.find(
    (chat) => chat._id === selectedChatId
  );

  const socket = useSocket(); // ✅ FIX
  const currentUserId = socket?.auth?.userId || null; // adjust depending on how you store user

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ✅ Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Register user
    socket.emit('register', currentUserId);

    // Incoming messages
    socket.on('receive_message', (msg) => {
      setChatMessages((prev) => [...prev, formatMessage(msg)]);
    });

    // Sent confirmation
    socket.on('message_sent', (msg) => {
      setChatMessages((prev) => {
        // replace temp message with actual
        return prev.map((m) =>
          m.id.startsWith('temp-') ? formatMessage(msg) : m
        );
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [socket, currentUserId]);

  // ✅ Format message from backend
  const formatMessage = (msg) => ({
    id: msg._id,
    sender: msg.senderId?.username || 'Unknown',
    senderId: msg.senderId?._id || msg.senderId,
    message: msg.text,
    time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    isMe: msg.senderId?._id === currentUserId,
    type: msg.messageType || 'text',
    edited: !!msg.editedAt,
  });

  // ✅ Send message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChatId || !socket) return;

    const receiverId = selectedChat.otherParticipant._id;

    // Optimistic UI
    const tempMessage = {
      id: 'temp-' + Date.now(),
      sender: 'You',
      senderId: currentUserId,
      message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isMe: true,
      type: 'text',
      edited: false,
    };
    setChatMessages((prev) => [...prev, tempMessage]);
    setMessage('');

    // Emit to server
    socket.emit('send_message', {
      senderId: currentUserId,
      receiverId,
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
    setError(null);
    // Optionally fetch chat history via API here
  };

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
            {userChatDetails.map((chat) => (
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
                    <AvatarImage src={chat.otherParticipant?.photoUrl} />
                    <AvatarFallback>??</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h4 className='font-medium'>
                      {chat.otherParticipant?.firstName || 'Unknown'}
                    </h4>
                    <p className='text-sm text-muted-foreground truncate'>
                      {chat.lastMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && <Badge>{chat.unreadCount}</Badge>}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className='lg:col-span-2'>
        {selectedChat ? (
          <>
            <CardHeader>{selectedChat.otherParticipant?.firstName}</CardHeader>
            <CardContent className='p-0'>
              <ScrollArea className='h-[400px] p-4'>
                {chatMessages.map((msg) => (
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
                ))}
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
