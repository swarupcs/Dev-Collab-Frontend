import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getSocket } from '@/services/socket.service';
import { useConnections } from '@/hooks/useConnections';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, Paperclip, Mic, Smile, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: any;
  receiver: any;
  createdAt: string;
}

import apiClient from '@/api/client';

export default function ChatPage() {
  const { user, accessToken: token } = useAppSelector((state) => state.auth);
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchHistoricalMessages = async (userId: string) => {
    try {
      const response = await apiClient.get(`/messages/${userId}`);
      if (response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    if (selectedConversation?.id) {
      fetchHistoricalMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (token) {
      const socket = getSocket(token);

      const handleReceiveMessage = (message: Message) => {
        if (selectedConversation && (message.sender.id === selectedConversation.id || message.receiver.id === selectedConversation.id)) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);

      // Mock API call to fetch initial conversations and messages
      if (connections) {
        const convs = connections.map((c) => (c.sender.id === user?.id ? c.receiver : c.sender));
        setConversations(convs);

        const conversationIdFromUrl = searchParams.get('user');
        if (conversationIdFromUrl) {
          const foundConv = convs.find((c) => c.id === conversationIdFromUrl);
          if (foundConv) setSelectedConversation(foundConv);
        }
      }

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [token, connections, selectedConversation, searchParams, user?.id]);  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !token) return;

    const socket = getSocket(token);
    const message = {
      content: newMessage,
      receiverId: selectedConversation.id,
    };
    
    socket.emit('sendMessage', message, (ack: any) => {
      if (!ack.error) {
        setMessages(prev => [...prev, ack.message]);
        setNewMessage('');
      }
    });
  };
  
  const filteredConversations = conversations.filter(c => 
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
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {connectionsLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  setMessages([]); // Clear messages when changing conversation
                  setSearchParams({ user: conv.id });
                  fetchHistoricalMessages(conv.id);
                }}                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-l-4 ${selectedConversation?.id === conv.id ? 'bg-primary/10 border-primary' : 'border-transparent hover:bg-muted/50'}`}
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src={conv.avatarUrl} alt={conv.firstName} />
                  <AvatarFallback>{conv.firstName[0]}{conv.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">{conv.firstName} {conv.lastName}</p>
                  <p className="text-sm text-muted-foreground truncate">Last message preview...</p>
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
                <AvatarImage src={selectedConversation.avatarUrl} />
                <AvatarFallback>{selectedConversation.firstName[0]}{selectedConversation.lastName[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedConversation.firstName} {selectedConversation.lastName}</h3>
            </header>

            <div className="flex-1 p-6 overflow-y-auto bg-background/40">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender.id === user?.id ? 'justify-end' : ''}`}>
                    {msg.sender.id !== user?.id && (
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={msg.sender.avatarUrl} />
                        <AvatarFallback>{msg.sender.firstName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-md p-3.5 rounded-2xl ${msg.sender.id === user?.id ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card rounded-bl-none'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1.5 opacity-60 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                  onChange={e => setNewMessage(e.target.value)} 
                  placeholder="Type a message..." 
                  className="flex-1 h-11"
                />
                <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-5 w-5" /></Button>
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
