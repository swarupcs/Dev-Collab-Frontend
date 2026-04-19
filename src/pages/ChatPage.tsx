import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getSocket } from '@/services/socket.service';
import { useConnections } from '@/hooks/useConnections';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, Paperclip, Mic, Smile, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Connection, ApiResponse } from '@/types/api';

import apiClient from '@/api/client';

// The populated user shape that comes back from sender/receiver after populate()
interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

interface Message {
  id: string;
  content: string;
  sender: ChatUser;
  receiver: ChatUser;
  createdAt: string;
  read?: boolean;
}

interface SendMessageAck {
  message?: Message;
  error?: string;
}

interface ConversationItem {
  user: ChatUser;
  lastMessage: Message;
  unreadCount: number;
}

export default function ChatPage() {
  const { user, accessToken: token } = useAppSelector((state) => state.auth);
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const [searchParams, setSearchParams] = useSearchParams();

  // Conversations are derived from connections — no separate state needed
  const conversations = useMemo<ChatUser[]>(() => {
    if (!connections) return [];
    return connections.map((c: Connection) =>
      c.sender.id === user?.id ? c.receiver : c.sender
    );
  }, [connections, user?.id]);

  const [lastMessages, setLastMessages] = useState<Record<string, Message>>({});
  const conversationIdFromUrl = searchParams.get('user');
  const selectedConversation = useMemo<ChatUser | null>(() => {
    if (!conversationIdFromUrl || !conversations.length) return null;
    return conversations.find((c) => c.id === conversationIdFromUrl) || null;
  }, [conversations, conversationIdFromUrl]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stable fetch callbacks — wrapped in useCallback so effects can depend on them
  const fetchHistoricalMessages = useCallback(async (userId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Message[]>>(`/messages/${userId}`);
      if (response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  const fetchConversationsWithLastMessage = useCallback(async () => {
    try {
      const response = await apiClient.get<ApiResponse<ConversationItem[]>>(`/messages/conversations`);
      if (response.data.data) {
        const map: Record<string, Message> = {};
        response.data.data.forEach((c) => {
          map[c.user.id] = c.lastMessage;
        });
        setLastMessages(map);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  // Fetch last messages once the token is available
  useEffect(() => {
    if (!token) return;
    const runFetch = async () => {
      await fetchConversationsWithLastMessage();
    };
    void runFetch();
  }, [token, fetchConversationsWithLastMessage]);

  // Fetch message history when a conversation is selected
  useEffect(() => {
    if (!selectedConversation?.id) return;
    const runFetch = async () => {
      await fetchHistoricalMessages(selectedConversation.id);
    };
    void runFetch();
  }, [selectedConversation?.id, fetchHistoricalMessages]);



  // Subscribe to real-time messages via socket
  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    const handleReceiveMessage = (message: Message) => {
      const otherUserId =
        message.sender.id === user?.id ? message.receiver.id : message.sender.id;

      setLastMessages((prev) => ({ ...prev, [otherUserId]: message }));

      if (
        selectedConversation &&
        (message.sender.id === selectedConversation.id ||
          message.receiver.id === selectedConversation.id)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [token, selectedConversation, user?.id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !token) return;

    const socket = getSocket(token);
    socket.emit(
      'sendMessage',
      { content: newMessage, receiverId: selectedConversation.id },
      (ack: SendMessageAck) => {
        if (!ack.error && ack.message) {
          setMessages((prev) => [...prev, ack.message!]);
          setLastMessages((prev) => ({
            ...prev,
            [selectedConversation.id]: ack.message!,
          }));
          setNewMessage('');
        }
      }
    );
  };

  const filteredConversations = conversations.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex bg-card/50 border border-border/50 rounded-2xl overflow-hidden">
      {/* Conversations Sidebar */}
      <aside className="w-80 border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {connectionsLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setMessages([]);
                  setSearchParams({ user: conv.id });
                }}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-l-4 ${
                  selectedConversation?.id === conv.id
                    ? 'bg-primary/10 border-primary'
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src={conv.avatarUrl ?? undefined} alt={conv.firstName} />
                  <AvatarFallback>
                    {conv.firstName[0]}
                    {conv.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">
                    {conv.firstName} {conv.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessages[conv.id]
                      ? `${lastMessages[conv.id].sender.id === user?.id ? 'You: ' : ''}${lastMessages[conv.id].content}`
                      : 'Start a conversation'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">No contacts found.</div>
          )}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <header className="p-4 border-b border-border/50 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatarUrl ?? undefined} />
                <AvatarFallback>
                  {selectedConversation.firstName[0]}
                  {selectedConversation.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">
                {selectedConversation.firstName} {selectedConversation.lastName}
              </h3>
            </header>

            <div className="flex-1 p-6 overflow-y-auto bg-background/40">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender.id === user?.id ? 'justify-end' : ''}`}
                  >
                    {msg.sender.id !== user?.id && (
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={msg.sender.avatarUrl ?? undefined} />
                        <AvatarFallback>{msg.sender.firstName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-md p-3.5 rounded-2xl ${
                        msg.sender.id === user?.id
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1.5 opacity-60 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="p-4 border-t border-border/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-11"
                />
                <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-muted-foreground">
            <div className="space-y-2">
              <MessageSquare className="h-12 w-12 mx-auto" />
              <h2 className="text-xl font-medium">Select a conversation</h2>
              <p className="text-sm">Start messaging your connections.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
