import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Send, MoreVertical, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_CONTACTS = [
  { id: '1', name: 'Alex Smith', avatar: 'AS', lastMessage: 'That sounds like a great plan!', time: '10:42 AM', online: true },
  { id: '2', name: 'Sarah Jenkins', avatar: 'SJ', lastMessage: 'Can you review my PR?', time: 'Yesterday', online: false },
  { id: '3', name: 'Design Team', avatar: 'DT', lastMessage: 'The new mockups are ready.', time: 'Tuesday', online: true },
];

const AUTO_REPLIES = [
  "That's a very interesting point. I completely agree.",
  "Could you elaborate a bit more on that?",
  "I'll look into it and get back to you shortly.",
  "Awesome! Let's schedule a call tomorrow to discuss.",
  "I think we need to test this thoroughly before deploying.",
  "**LGTM!** Go ahead and merge.",
  "Check out this code snippet: `npm install lucide-react`",
];

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

// Basic markdown parser
const renderMarkdown = (text: string) => {
  let html = text.replace(/<[^>]*>?/gm, ''); // sanitize basic HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bold
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // italic
  html = html.replace(/`(.*?)`/g, '<code class="bg-card/50 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'); // inline code
  html = html.replace(/\n\n/g, '<br/><br/>'); // paragraphs
  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose-chat" />;
};

export default function ChatPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeContactId, setActiveContactId] = useState('1');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'm1', text: 'Hey there! How is the project coming along?', senderId: '1', timestamp: '10:30 AM' },
      { id: 'm2', text: 'Making good progress. Just finished the UI.', senderId: 'me', timestamp: '10:35 AM' },
      { id: 'm3', text: 'That sounds like a great plan!', senderId: '1', timestamp: '10:42 AM' },
    ],
    '2': [
      { id: 'm1', text: 'Can you review my PR?', senderId: '2', timestamp: 'Yesterday' }
    ],
    '3': [
      { id: 'm1', text: 'The new mockups are ready.', senderId: '3', timestamp: 'Tuesday' }
    ]
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);
  const currentMessages = messages[activeContactId] || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    setInputText('');

    // Trigger auto reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        senderId: activeContactId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), replyMessage]
      }));
    }, 1500);
  };

  return (
    <div className="card-modern flex flex-col md:flex-row shadow-card h-[calc(100vh-140px)] overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border/50 flex flex-col bg-sidebar/50">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2 mb-4">
            Messages <span className="tag-primary ml-auto">3 New</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="input-modern pl-9 py-2 text-sm bg-background border-border/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar py-2">
          {MOCK_CONTACTS.map(contact => (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors ${
                activeContactId === contact.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted/50 border-l-2 border-transparent'
              }`}
            >
              <div className="relative">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  activeContactId === contact.id ? 'gradient-primary' : 'bg-muted-foreground/30 text-foreground'
                }`}>
                  {contact.avatar}
                </div>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card ring-1 ring-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`text-sm truncate ${activeContactId === contact.id ? 'font-semibold text-primary' : 'font-medium text-foreground'}`}>
                    {contact.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{contact.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background/50">
        {/* Chat Header */}
        <div className="h-[72px] px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow">
              {activeContact?.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-foreground leading-tight">{activeContact?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {activeContact?.online ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
          <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
          <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)] grid-pattern pointer-events-none" />
          
          <AnimatePresence initial={false}>
            {currentMessages.map((msg, index) => {
              const isMe = msg.senderId === 'me';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  layout
                  className={`flex flex-col relative z-10 ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-card border border-border/50 text-foreground rounded-bl-sm'
                  }`}>
                    {renderMarkdown(msg.text)}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    {isMe && <CheckCircle2 className="h-3 w-3 text-primary" />}
                  </div>
                </motion.div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-start relative z-10"
              >
                <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
                  <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message (Markdown supported)..."
              className="flex-1 input-modern bg-background py-3"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              className="h-[46px] w-[46px] rounded-lg gradient-primary flex items-center justify-center text-white shadow-glow hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
            >
              <Send className="h-5 w-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
