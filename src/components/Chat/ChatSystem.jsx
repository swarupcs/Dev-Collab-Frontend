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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Code,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Pin,
  Archive,
  Trash2,
  Copy,
  Reply,
  Edit2,
  Check,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// Note: Socket.IO client not available in artifacts.
// For production, install: npm install socket.io-client
// Then import: import { io } from 'socket.io-client';

export default function ChatSystem() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = useRef(null);
  const API_BASE = 'http://localhost:8080/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Fetch user's chats on mount
  useEffect(() => {
    fetchUserChats();
  }, []);

  const fetchUserChats = async () => {
    try {
      setIsLoadingChats(true);
      setError(null);

      const response = await fetch(`${API_BASE}/chats/getUserChats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const chats = data.data?.chats || [];
      setUserChats(chats);

      // Set current user ID from first chat if available
      if (chats.length > 0 && chats[0].participants) {
        const firstChat = chats[0];
        const otherParticipant = firstChat.otherParticipant;
        // Current user is the one who is NOT the other participant
        const currentUser = firstChat.participants.find(
          (p) => p._id !== otherParticipant._id
        );
        if (currentUser) {
          currentUserId.current = currentUser._id;
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to load chats. Please check your connection.');
    } finally {
      setIsLoadingChats(false);
    }
  };

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      loadChatMessages();
    }
  }, [selectedChatId]);

  const loadChatMessages = async () => {
    if (!selectedChatId) return;

    try {
      setIsLoadingMessages(true);
      setError(null);

      const selectedChat = userChats.find(
        (chat) => chat._id === selectedChatId
      );
      if (!selectedChat) return;

      const otherUserId = selectedChat.otherParticipant._id;

      const response = await fetch(
        `${API_BASE}/messages/${otherUserId}?page=1&limit=50`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const messages = (data.data?.messages || []).map((msg) => ({
        id: msg._id,
        sender: msg.senderId.username,
        senderId: msg.senderId._id,
        message: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        isMe: msg.senderId._id === currentUserId.current,
        type: msg.messageType || 'text',
        edited: msg.editedAt ? true : false,
      }));

      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleChatSelect = async (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatId) return;

    try {
      const selectedChat = userChats.find(
        (chat) => chat._id === selectedChatId
      );
      if (!selectedChat) return;

      const receiverId = selectedChat.otherParticipant._id;

      // Optimistically add message to UI
      const tempMessage = {
        id: 'temp-' + Date.now(),
        sender: 'You',
        senderId: currentUserId.current,
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

      // In production with Socket.IO:
      // socket.emit('sendMessage', { receiverId, text: message, messageType: 'text' }, callback);

      // For now, show info that Socket.IO is needed
      console.log('Socket.IO required to send real-time messages');
      console.log('Install: npm install socket.io-client');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Socket.IO connection required.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startEdit = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const getStatusColor = (lastSeen) => {
    if (!lastSeen) return 'bg-gray-400';

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const minutesAgo = (now - lastSeenDate) / (1000 * 60);

    if (minutesAgo < 5) return 'bg-green-500';
    if (minutesAgo < 30) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatLastMessageTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const filteredChats = userChats.filter(
    (chat) =>
      chat.otherParticipant?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chat.otherParticipant?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const selectedChat = userChats.find((c) => c._id === selectedChatId);

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
            <Button
              variant='ghost'
              size='sm'
              onClick={fetchUserChats}
              disabled={isLoadingChats}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingChats ? 'animate-spin' : ''}`}
              />
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
            {error && (
              <div className='p-3 m-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2'>
                <AlertCircle className='h-4 w-4' />
                <span className='text-sm'>{error}</span>
              </div>
            )}
            <div className='space-y-1 p-3'>
              {isLoadingChats ? (
                <div className='text-center p-4 text-muted-foreground'>
                  Loading chats...
                </div>
              ) : filteredChats.length === 0 ? (
                <div className='text-center p-4 text-muted-foreground'>
                  {searchQuery ? 'No chats found' : 'No conversations yet'}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChatId === chat._id
                        ? 'bg-accent'
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => handleChatSelect(chat._id)}
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='relative'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage
                            src={
                              chat.otherParticipant?.avatar ||
                              '/placeholder.svg'
                            }
                          />
                          <AvatarFallback>
                            {chat.otherParticipant?.username
                              ?.substring(0, 2)
                              .toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                            chat.otherParticipant?.lastSeen
                          )}`}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-medium truncate'>
                            {chat.otherParticipant?.username || 'Unknown User'}
                          </h4>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-muted-foreground'>
                              {formatLastMessageTime(
                                chat.lastMessage?.createdAt
                              )}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge
                                variant='default'
                                className='h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
                              >
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm text-muted-foreground truncate'>
                            {chat.lastMessage?.text || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className='lg:col-span-2'>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <CardHeader className='border-b border-border pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='relative'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={
                          selectedChat.otherParticipant?.avatar ||
                          '/placeholder.svg'
                        }
                      />
                      <AvatarFallback>
                        {selectedChat.otherParticipant?.username
                          ?.substring(0, 2)
                          .toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                        selectedChat.otherParticipant?.lastSeen
                      )}`}
                    />
                  </div>
                  <div>
                    <CardTitle className='text-lg'>
                      {selectedChat.otherParticipant?.username ||
                        'Unknown User'}
                    </CardTitle>
                    <CardDescription>
                      {isTyping
                        ? 'typing...'
                        : selectedChat.otherParticipant?.email || ''}
                    </CardDescription>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='icon'>
                    <Phone className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Video className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Info className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className='p-0'>
              <ScrollArea className='h-[400px] p-4'>
                {isLoadingMessages ? (
                  <div className='text-center p-4 text-muted-foreground'>
                    Loading messages...
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {chatMessages.length === 0 ? (
                      <div className='text-center p-8 text-muted-foreground'>
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.isMe ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className={`max-w-[70%] group`}>
                            {editingMessageId === msg.id ? (
                              <div className='space-y-2 p-3 rounded-lg bg-muted'>
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className='text-sm'
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') cancelEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                  }}
                                />
                                <div className='flex gap-2'>
                                  <Button size='sm' onClick={cancelEdit}>
                                    <Check className='h-4 w-4 mr-1' />
                                    Save (Requires Socket.IO)
                                  </Button>
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={cancelEdit}
                                  >
                                    <X className='h-4 w-4 mr-1' />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-3 rounded-lg ${
                                  msg.isMe
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className='text-sm whitespace-pre-wrap'>
                                  {msg.message}
                                </p>

                                <div className='flex items-center justify-between mt-2'>
                                  <div className='flex items-center gap-2'>
                                    <p
                                      className={`text-xs ${
                                        msg.isMe
                                          ? 'text-primary-foreground/70'
                                          : 'text-muted-foreground'
                                      }`}
                                    >
                                      {msg.time}
                                    </p>
                                    {msg.edited && (
                                      <span
                                        className={`text-xs italic ${
                                          msg.isMe
                                            ? 'text-primary-foreground/50'
                                            : 'text-muted-foreground/50'
                                        }`}
                                      >
                                        edited
                                      </span>
                                    )}
                                  </div>

                                  {/* Message Actions */}
                                  {msg.isMe && (
                                    <div className='opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1'>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-6 w-6 p-0'
                                        onClick={() =>
                                          startEdit(msg.id, msg.message)
                                        }
                                      >
                                        <Edit2 className='h-3 w-3' />
                                      </Button>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-6 w-6 p-0'
                                        onClick={() =>
                                          alert(
                                            'Delete requires Socket.IO connection'
                                          )
                                        }
                                      >
                                        <Trash2 className='h-3 w-3' />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className='p-4'>
                <div className='flex items-end space-x-2'>
                  <div className='flex-1 space-y-2'>
                    <Textarea
                      placeholder='Type your message...'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className='min-h-[40px] max-h-[120px] resize-none'
                      rows={1}
                    />
                    <div className='flex items-center justify-between'>
                      <div className='flex gap-2'>
                        <Button variant='ghost' size='sm'>
                          <Paperclip className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <Code className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <Smile className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Press Enter to send
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className='mb-8'
                  >
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
                <div className='mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-2'>
                  <AlertCircle className='h-4 w-4 flex-shrink-0 mt-0.5' />
                  <div>
                    <strong>Note:</strong> Real-time messaging requires
                    Socket.IO client. Install with:{' '}
                    <code className='bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded'>
                      npm install socket.io-client
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <MessageSquare className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>
                Select a conversation
              </h3>
              <p className='text-muted-foreground'>
                Choose a chat to start messaging
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
