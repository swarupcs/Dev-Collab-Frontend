import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  MessageCircle,
  User,
  Settings,
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  UserPlus,
  Activity,
  Code,
  GitBranch,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [connectionSearch, setConnectionSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');

  const connections = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Frontend Developer',
      company: 'Vercel',
      avatar: '/professional-woman-developer.png',
      status: 'online',
      connectionStatus: 'connected',
      lastMessage:
        'Hey! I saw your latest project on GitHub. Really impressive work with the React components!',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      mutualConnections: 12,
      skills: ['React', 'TypeScript', 'Next.js'],
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      title: 'Full Stack Engineer',
      company: 'Stripe',
      avatar: '/professional-man-developer.png',
      status: 'away',
      connectionStatus: 'connected',
      lastMessage:
        "Thanks for the code review! I'll implement those changes today.",
      lastMessageTime: '1h ago',
      mutualConnections: 8,
      skills: ['Node.js', 'Python', 'AWS'],
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'DevOps Engineer',
      company: 'GitHub',
      avatar: '/professional-woman-engineer.png',
      status: 'online',
      connectionStatus: 'pending_received',
      lastMessage: 'The deployment pipeline looks good. Ready to merge?',
      lastMessageTime: '3h ago',
      unreadCount: 1,
      mutualConnections: 15,
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Mobile Developer',
      company: 'Spotify',
      avatar: '/professional-developer-mobile.jpg',
      status: 'offline',
      connectionStatus: 'pending_sent',
      mutualConnections: 5,
      skills: ['React Native', 'Swift', 'Kotlin'],
    },
    {
      id: 5,
      name: 'Lisa Wang',
      title: 'Data Engineer',
      company: 'Netflix',
      avatar: '/professional-woman-data-engineer.jpg',
      status: 'online',
      connectionStatus: 'suggested',
      mutualConnections: 23,
      skills: ['Python', 'Spark', 'SQL'],
    },
  ];

  const messages = selectedChat
    ? [
        {
          id: 1,
          senderId: selectedChat.id,
          content: selectedChat.lastMessage || 'Hello!',
          timestamp: '10:30 AM',
          type: 'text',
        },
        {
          id: 2,
          senderId: 0, // Current user
          content:
            "Thanks! I'd love to collaborate on more projects like this.",
          timestamp: '10:32 AM',
          type: 'text',
        },
        {
          id: 3,
          senderId: selectedChat.id,
          content:
            "```javascript\nconst handleSubmit = async (data) => {\n  try {\n    await api.post('/users', data)\n  } catch (error) {\n    console.error(error)\n  }\n}\n```",
          timestamp: '10:35 AM',
          type: 'code',
        },
      ]
    : [];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'connections', label: 'Connections', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 3 },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic here
      setMessageInput('');
    }
  };

  const getFilteredConnections = (tab) => {
    console.log(
      '[v0] Filtering connections for tab:',
      tab,
      'search:',
      connectionSearch
    );
    let filtered = connections;

    // Filter by tab
    switch (tab) {
      case 'all':
        filtered = connections;
        break;
      case 'send':
        filtered = connections.filter(
          (c) => c.connectionStatus === 'pending_sent'
        );
        break;
      case 'review':
        filtered = connections.filter(
          (c) => c.connectionStatus === 'pending_received'
        );
        break;
      case 'suggestions':
        filtered = connections.filter(
          (c) => c.connectionStatus === 'suggested'
        );
        break;
      default:
        filtered = connections;
    }

    if (connectionSearch.trim()) {
      filtered = filtered.filter(
        (connection) =>
          connection.name
            .toLowerCase()
            .includes(connectionSearch.toLowerCase()) ||
          connection.title
            .toLowerCase()
            .includes(connectionSearch.toLowerCase()) ||
          connection.company
            .toLowerCase()
            .includes(connectionSearch.toLowerCase()) ||
          connection.skills?.some((skill) =>
            skill.toLowerCase().includes(connectionSearch.toLowerCase())
          )
      );
    }

    console.log('[v0] Filtered connections result:', filtered.length);
    return filtered;
  };

  const getFilteredConversations = () => {
    console.log('[v0] Filtering conversations with search:', messageSearch);
    if (!messageSearch.trim()) {
      return connections.filter((c) => c.lastMessage); // Only show connections with messages
    }

    const filtered = connections
      .filter((c) => c.lastMessage) // Only show connections with messages
      .filter(
        (connection) =>
          connection.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
          connection.lastMessage
            ?.toLowerCase()
            .includes(messageSearch.toLowerCase())
      );

    console.log('[v0] Filtered conversations result:', filtered.length);
    return filtered;
  };

  const renderOverview = () => (
    <div className='space-y-8'>
      <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-foreground'>
          Welcome back, Alex
        </h1>
        <p className='text-muted-foreground'>
          Here's what's happening with your developer network
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        <Card className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-chart-1/20 rounded-lg'>
              <Users className='h-6 w-6 text-chart-1' />
            </div>
            <div>
              <p className='text-2xl font-bold text-foreground'>127</p>
              <p className='text-sm text-muted-foreground'>Connections</p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-chart-2/20 rounded-lg'>
              <MessageCircle className='h-6 w-6 text-chart-2' />
            </div>
            <div>
              <p className='text-2xl font-bold text-foreground'>23</p>
              <p className='text-sm text-muted-foreground'>Active Chats</p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-chart-3/20 rounded-lg'>
              <Code className='h-6 w-6 text-chart-3' />
            </div>
            <div>
              <p className='text-2xl font-bold text-foreground'>8</p>
              <p className='text-sm text-muted-foreground'>Collaborations</p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-chart-4/20 rounded-lg'>
              <TrendingUp className='h-6 w-6 text-chart-4' />
            </div>
            <div>
              <p className='text-2xl font-bold text-foreground'>94%</p>
              <p className='text-sm text-muted-foreground'>Profile Views</p>
            </div>
          </div>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-foreground mb-6'>
            Recent Activity
          </h3>
          <div className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-chart-1/20 rounded-full'>
                <UserPlus className='h-4 w-4 text-chart-1' />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-foreground'>
                  Sarah Chen accepted your connection request
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  2 hours ago
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-chart-2/20 rounded-full'>
                <MessageCircle className='h-4 w-4 text-chart-2' />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-foreground'>
                  New message from Marcus Johnson
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  4 hours ago
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-chart-3/20 rounded-full'>
                <GitBranch className='h-4 w-4 text-chart-3' />
              </div>
              <div className='flex-1'>
                <p className='text-sm text-foreground'>
                  Elena Rodriguez shared a project with you
                </p>
                <p className='text-xs text-muted-foreground mt-1'>1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-foreground mb-6'>
            Trending Skills
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-foreground'>React</span>
              <Badge variant='secondary'>+12%</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-foreground'>TypeScript</span>
              <Badge variant='secondary'>+8%</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-foreground'>Next.js</span>
              <Badge variant='secondary'>+15%</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-foreground'>Node.js</span>
              <Badge variant='secondary'>+6%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className='flex h-[calc(100vh-8rem)]'>
      {/* Conversations sidebar */}
      <div className='w-80 border-r border-border flex flex-col bg-card'>
        <div className='p-6 border-b border-border'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search conversations...'
              className='pl-10 bg-background border-border focus:border-ring focus:ring-ring'
              value={messageSearch}
              onChange={(e) => {
                console.log('[v0] Message search changed:', e.target.value);
                setMessageSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <ScrollArea className='flex-1'>
          <div className='p-4 space-y-3'>
            {getFilteredConversations().map((connection) => (
              <div
                key={connection.id}
                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors border ${
                  selectedChat?.id === connection.id
                    ? 'bg-accent border-accent-foreground/20'
                    : 'hover:bg-accent/50 border-transparent hover:border-border'
                }`}
                onClick={() => setSelectedChat(connection)}
              >
                <div className='relative'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage
                      src={connection.avatar || '/placeholder.svg'}
                      alt={connection.name}
                    />
                    <AvatarFallback>
                      {connection.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                      connection.status === 'online'
                        ? 'bg-green-500'
                        : connection.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <p className='font-medium text-foreground truncate'>
                      {connection.name}
                    </p>
                    {connection.lastMessageTime && (
                      <span className='text-xs text-muted-foreground'>
                        {connection.lastMessageTime}
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground truncate'>
                    {connection.lastMessage}
                  </p>
                </div>
                {connection.unreadCount && (
                  <Badge
                    variant='destructive'
                    className='h-5 w-5 rounded-full p-0 text-xs'
                  >
                    {connection.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
            {getFilteredConversations().length === 0 && (
              <div className='text-center py-12'>
                <MessageCircle className='h-8 w-8 text-muted-foreground mx-auto mb-3' />
                <p className='text-sm text-muted-foreground'>
                  No conversations found
                </p>
                {messageSearch.trim() && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Try a different search term
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className='flex-1 flex flex-col bg-background'>
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className='p-6 border-b border-border flex items-center justify-between bg-card'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage
                    src={selectedChat.avatar || '/placeholder.svg'}
                    alt={selectedChat.name}
                  />
                  <AvatarFallback>
                    {selectedChat.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold text-foreground'>
                    {selectedChat.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {selectedChat.title}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon' className='hover:bg-accent'>
                  <Phone className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='hover:bg-accent'>
                  <Video className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='hover:bg-accent'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className='flex-1 p-6'>
              <div className='space-y-6'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 0 ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                        message.senderId === 0
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      {message.type === 'code' ? (
                        <pre className='text-xs overflow-x-auto whitespace-pre-wrap bg-muted/50 p-2 rounded'>
                          <code>{message.content}</code>
                        </pre>
                      ) : (
                        <p className='text-sm'>{message.content}</p>
                      )}
                      <p className='text-xs opacity-70 mt-2'>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className='p-6 border-t border-border bg-card'>
              <div className='flex items-center gap-3'>
                <Input
                  placeholder='Type a message...'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className='flex-1 bg-background border-border focus:border-ring focus:ring-ring'
                />
                <Button
                  onClick={handleSendMessage}
                  size='icon'
                  className='bg-primary hover:bg-primary/90'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <MessageCircle className='h-16 w-16 text-muted-foreground mx-auto mb-6' />
              <h3 className='text-xl font-semibold text-foreground mb-3'>
                Select a conversation
              </h3>
              <p className='text-muted-foreground'>
                Choose a connection to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConnections = () => {
    const filteredConnections = getFilteredConnections(activeTab);

    return (
      <div className='space-y-8 p-8'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-foreground'>Connections</h1>
            <p className='text-muted-foreground'>
              Manage your professional developer network
            </p>
          </div>
          <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
            <UserPlus className='h-4 w-4 mr-2' />
            Find Developers
          </Button>
        </div>

        <div className='border-b border-border'>
          <nav className='flex space-x-12'>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'all' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              All Connection Requests ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'send' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Send Connection Requests (
              {
                connections.filter((c) => c.connectionStatus === 'pending_sent')
                  .length
              }
              )
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'review' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Review Connection Requests (
              {
                connections.filter(
                  (c) => c.connectionStatus === 'pending_received'
                ).length
              }
              )
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'suggestions' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Suggestion Connection Requests (
              {
                connections.filter((c) => c.connectionStatus === 'suggested')
                  .length
              }
              )
            </button>
          </nav>
        </div>

        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search connections...'
            className='pl-10 bg-background border-border focus:border-ring focus:ring-ring'
            value={connectionSearch}
            onChange={(e) => {
              console.log('[v0] Connection search changed:', e.target.value);
              setConnectionSearch(e.target.value);
            }}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredConnections.map((connection) => (
            <div key={connection.id} className='connection-card p-6 rounded-lg'>
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <Avatar className='h-16 w-16 ring-2 ring-border'>
                    <AvatarImage
                      src={connection.avatar || '/placeholder.svg'}
                      alt={connection.name}
                    />
                    <AvatarFallback className='bg-muted text-muted-foreground font-semibold'>
                      {connection.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
                      connection.status === 'online'
                        ? 'bg-green-500'
                        : connection.status === 'away'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='space-y-1'>
                      <h3 className='font-semibold text-foreground truncate'>
                        {connection.name}
                      </h3>
                      <p className='text-sm text-muted-foreground truncate'>
                        {connection.title}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {connection.company}
                      </p>
                    </div>

                    <div className='flex flex-col items-end gap-1'>
                      {connection.connectionStatus === 'connected' && (
                        <Badge className='status-badge-connected border'>
                          <CheckCircle className='h-3 w-3 mr-1' />
                          Connected
                        </Badge>
                      )}
                      {connection.connectionStatus === 'pending_sent' && (
                        <Badge className='status-badge-pending border'>
                          <Clock className='h-3 w-3 mr-1' />
                          Sent
                        </Badge>
                      )}
                      {connection.connectionStatus === 'pending_received' && (
                        <Badge className='status-badge-review border'>
                          <UserCheck className='h-3 w-3 mr-1' />
                          Review
                        </Badge>
                      )}
                      {connection.connectionStatus === 'suggested' && (
                        <Badge className='status-badge-suggested border'>
                          <UserPlus className='h-3 w-3 mr-1' />
                          Suggested
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className='text-xs text-muted-foreground mb-3 flex items-center'>
                    <Users className='h-3 w-3 mr-1' />
                    {connection.mutualConnections} mutual connections
                  </p>

                  {connection.skills && (
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {connection.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant='outline'
                          className='text-xs bg-muted text-muted-foreground border-border'
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className='flex gap-3 mt-4'>
                    {connection.connectionStatus === 'connected' && (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          className='flex-1 bg-background border-border text-foreground hover:bg-accent'
                        >
                          <MessageCircle className='h-4 w-4 mr-1' />
                          Message
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='bg-background border-border text-foreground hover:bg-accent'
                        >
                          <User className='h-4 w-4' />
                        </Button>
                      </>
                    )}
                    {connection.connectionStatus === 'pending_received' && (
                      <>
                        <Button
                          size='sm'
                          className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                        >
                          <CheckCircle className='h-4 w-4 mr-1' />
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='bg-background border-border text-foreground hover:bg-accent'
                        >
                          <XCircle className='h-4 w-4 mr-1' />
                          Decline
                        </Button>
                      </>
                    )}
                    {connection.connectionStatus === 'pending_sent' && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1 bg-muted border-border text-muted-foreground'
                        disabled
                      >
                        <Clock className='h-4 w-4 mr-1' />
                        Request Sent
                      </Button>
                    )}
                    {connection.connectionStatus === 'suggested' && (
                      <>
                        <Button
                          size='sm'
                          className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground'
                        >
                          <UserPlus className='h-4 w-4 mr-1' />
                          Connect
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='bg-background border-border text-foreground hover:bg-accent'
                        >
                          <UserX className='h-4 w-4 mr-1' />
                          Ignore
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConnections.length === 0 && (
          <div className='text-center py-16'>
            <Users className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No connections found
            </h3>
            <p className='text-muted-foreground'>
              Try adjusting your search or explore different connection
              categories.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'messages':
        return renderMessages();
      case 'connections':
        return renderConnections();
      case 'projects':
        return <div className='p-6'>Projects section coming soon...</div>;
      case 'profile':
        return <div className='p-6'>Profile settings coming soon...</div>;
      case 'settings':
        return <div className='p-6'>Settings panel coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className='flex h-screen bg-background'>
      <div className='w-64 bg-card border-r border-border'>
        <div className=' border-b border-border'>
          <h1 className='text-xl font-bold text-foreground'>Dev-Collab</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Developer Network
          </p>
        </div>

        <nav className='p-6'>
          <div className='space-y-3'>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  <span className='font-medium'>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant='destructive'
                      className='ml-auto h-5 w-5 rounded-full p-0 text-xs'
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className='absolute bottom-6 left-6 right-6'>
          <Card className='p-5'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src='/placeholder.svg?height=40&width=40'
                  alt='Alex'
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-foreground'>Alex Developer</p>
                <p className='text-sm text-muted-foreground truncate'>
                  Full Stack Engineer
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>{renderContent()}</div>
    </div>
  );
}
