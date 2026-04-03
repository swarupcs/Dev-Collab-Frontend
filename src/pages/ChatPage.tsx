import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Search,
  Send,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageTransition } from '@/components/PageTransition';
import { TypingIndicator } from '@/components/TypingIndicator';
import { EmojiReaction } from '@/components/EmojiReaction';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonList } from '@/components/SkeletonCard';
import { chatApi } from '@/services/mockApi';
import {
  mockUsers,
  type ChatConversation,
  type ChatMessage,
} from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatApi
      .getConversations()
      .then((convs) => {
        setConversations(convs);
        if (convs.length > 0) setSelectedConv(convs[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    chatApi.getMessages(selectedConv).then(setMessages);
  }, [selectedConv]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const getOtherUser = (conv: ChatConversation) => {
    const otherId = conv.participantIds.find((id) => id !== user?.id) || '';
    return mockUsers.find((u) => u.id === otherId);
  };

  const selectedOther = selectedConv
    ? getOtherUser(conversations.find((c) => c.id === selectedConv)!)
    : null;

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConv || !user) return;
    setSending(true);
    const msg = messageInput;
    setMessageInput('');
    const newMsg = await chatApi.sendMessage(selectedConv, user.id, msg);
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConv
          ? { ...c, lastMessage: msg, lastMessageTime: 'Just now' }
          : c,
      ),
    );
    setSending(false);

    // Simulate reply after delay
    setShowTyping(true);
    setTimeout(
      async () => {
        setShowTyping(false);
        const reply = await chatApi.sendMessage(
          selectedConv,
          selectedOther?.id || '',
          getAutoReply(),
        );
        setMessages((prev) => [...prev, reply]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConv
              ? {
                  ...c,
                  lastMessage: reply.message,
                  lastMessageTime: 'Just now',
                }
              : c,
          ),
        );
      },
      1500 + Math.random() * 2000,
    );
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!selectedConv || !user) return;
    await chatApi.addReaction(messageId, selectedConv, emoji, user.id);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.findIndex(
          (r) => r.userId === user.id && r.emoji === emoji,
        );
        const newReactions = [...m.reactions];
        if (existing >= 0) newReactions.splice(existing, 1);
        else newReactions.push({ emoji, userId: user.id });
        return { ...m, reactions: newReactions };
      }),
    );
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const other = getOtherUser(c);
    return (
      other &&
      `${other.firstName} ${other.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader title='Messages' />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid gap-6 lg:grid-cols-3 h-[calc(100vh-10rem)]'>
            {/* Conversations list */}
            <Card className='lg:col-span-1 glass border-border/50 shadow-card flex flex-col'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between mb-2'>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <MessageSquare className='h-5 w-5' />
                    Messages
                  </CardTitle>
                  <Button variant='ghost' size='sm'>
                    <RefreshCw className='h-4 w-4' />
                  </Button>
                </div>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search conversations...'
                    className='pl-10'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className='p-0 flex-1 overflow-hidden'>
                <ScrollArea className='h-full'>
                  {loading ? (
                    <SkeletonList count={4} />
                  ) : filteredConversations.length === 0 ? (
                    <p className='text-sm text-muted-foreground text-center py-8'>
                      No conversations
                    </p>
                  ) : (
                    filteredConversations.map((conv) => {
                      const other = getOtherUser(conv);
                      if (!other) return null;
                      return (
                        <div
                          key={conv.id}
                          className={`p-3 cursor-pointer transition-colors ${selectedConv === conv.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/50'}`}
                          onClick={() => setSelectedConv(conv.id)}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='relative'>
                              <Avatar className='h-10 w-10'>
                                <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                                  {other.firstName[0]}
                                  {other.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              {other.isOnline && (
                                <div className='absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500' />
                              )}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between'>
                                <h4 className='font-medium text-sm'>
                                  {other.firstName} {other.lastName}
                                </h4>
                                <span className='text-xs text-muted-foreground'>
                                  {conv.lastMessageTime}
                                </span>
                              </div>
                              <p className='text-sm text-muted-foreground truncate'>
                                {conv.lastMessage}
                              </p>
                            </div>
                            {conv.unread > 0 && (
                              <Badge className='gradient-primary text-primary-foreground h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center border-0'>
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat area */}
            <Card className='lg:col-span-2 glass border-border/50 shadow-card flex flex-col'>
              {selectedConv && selectedOther ? (
                <>
                  <CardHeader className='pb-3 border-b border-border/50'>
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback className='bg-primary/10 text-primary font-heading text-xs'>
                            {selectedOther.firstName[0]}
                            {selectedOther.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {selectedOther.isOnline && (
                          <div className='absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500' />
                        )}
                      </div>
                      <div>
                        <h4 className='font-heading font-semibold'>
                          {selectedOther.firstName} {selectedOther.lastName}
                        </h4>
                        <p className='text-xs text-muted-foreground'>
                          {selectedOther.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1 p-0 flex flex-col overflow-hidden'>
                    <ScrollArea className='flex-1 p-4'>
                      <div className='space-y-4'>
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} group`}
                          >
                            <div className='max-w-[70%]'>
                              <div
                                className={`p-3 rounded-2xl ${
                                  msg.senderId === user?.id
                                    ? 'gradient-primary text-primary-foreground rounded-br-md'
                                    : 'bg-muted rounded-bl-md'
                                }`}
                              >
                                <p className='text-sm'>{msg.message}</p>
                                <p className='text-xs opacity-70 mt-1'>
                                  {msg.timestamp}
                                </p>
                              </div>
                              <EmojiReaction
                                reactions={msg.reactions}
                                onReact={(emoji) =>
                                  handleReaction(msg.id, emoji)
                                }
                                currentUserId={user?.id || ''}
                              />
                            </div>
                          </motion.div>
                        ))}
                        {showTyping && (
                          <div className='flex justify-start'>
                            <TypingIndicator />
                          </div>
                        )}
                        <div ref={scrollRef} />
                      </div>
                    </ScrollArea>
                    <div className='p-4 border-t border-border/50'>
                      <div className='flex gap-2'>
                        <Textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder='Type your message...'
                          className='min-h-[44px] max-h-[100px] resize-none'
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                        />
                        <Button
                          className='self-end gradient-primary border-0 shadow-glow'
                          disabled={!messageInput.trim() || sending}
                          onClick={handleSend}
                        >
                          <Send className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className='flex items-center justify-center h-full'>
                  <EmptyState
                    icon={MessageCircle}
                    title='Select a conversation'
                    description='Choose a chat from the left to start messaging.'
                  />
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

const autoReplies = [
  'That sounds great! Let me check and get back to you.',
  'Interesting idea! I think we could make that work.',
  "I'll push the changes to the repo tonight.",
  'Have you seen the latest release notes? Some cool features!',
  'Let me review the PR and merge it tomorrow.',
  '👍 Looks good to me!',
  "Sure, let's schedule a pair programming session.",
  'The tests are passing now. Ready for review!',
];

function getAutoReply() {
  return autoReplies[Math.floor(Math.random() * autoReplies.length)];
}
