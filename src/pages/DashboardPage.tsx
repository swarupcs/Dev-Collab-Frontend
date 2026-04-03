import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  Users,
  MessageSquare,
  Activity,
  Code,
  TrendingUp,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Calendar,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SkeletonCard, SkeletonList } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { PageTransition } from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import {
  usersApi,
  connectionsApi,
  activityApi,
  skillsApi,
} from '@/services/mockApi';
import {
  mockUsers,
  type MockUser,
  type ConnectionRequest,
  type ActivityEvent,
} from '@/services/mockData';
import { toast } from 'sonner';


export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [developers, setDevelopers] = useState<MockUser[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [trending, setTrending] = useState<
    { name: string; change: string; projects: number }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [devs, conns, acts, skills] = await Promise.all([
        usersApi.getAll(),
        connectionsApi.getForUser(user?.id || ''),
        activityApi.getAll(),
        skillsApi.getTrending(),
      ]);
      setDevelopers(devs.filter((d) => d.id !== user?.id));
      setConnections(conns);
      setActivities(acts);
      setTrending(skills);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const myConnections = connections.filter((c) => c.status === 'accepted');
  const pendingRequests = connections.filter(
    (c) => c.toUserId === user?.id && c.status === 'pending',
  );
  const connectedUserIds = new Set(
    myConnections.map((c) =>
      c.fromUserId === user?.id ? c.toUserId : c.fromUserId,
    ),
  );
  const sentRequestIds = new Set(
    connections
      .filter((c) => c.fromUserId === user?.id && c.status === 'pending')
      .map((c) => c.toUserId),
  );

  const filteredDevs = developers.filter((d) => {
    if (connectedUserIds.has(d.id)) return false;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
      d.skills.some((s) => s.toLowerCase().includes(q));
    const matchesSkill =
      skillFilter === 'all' || d.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  const handleConnect = async (targetId: string) => {
    try {
      const req = await connectionsApi.send(user?.id || '', targetId);
      setConnections((prev) => [...prev, req]);
      toast.success('Connection request sent!');
    } catch {
      toast.error('Failed to send connection request. Please try again.');
    }
  };

  const handleAccept = async (reqId: string) => {
    await connectionsApi.accept(reqId);
    setConnections((prev) =>
      prev.map((c) => (c.id === reqId ? { ...c, status: 'accepted' } : c)),
    );
    toast.success('Connection accepted!');
  };

  const handleReject = async (reqId: string) => {
    await connectionsApi.reject(reqId);
    setConnections((prev) =>
      prev.map((c) => (c.id === reqId ? { ...c, status: 'rejected' } : c)),
    );
    toast.error('Connection rejected.');
  };

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-8'
          >
            <TabsList className='glass border border-border/50 p-1 h-auto flex-wrap'>
              <TabsTrigger
                value='overview'
                className='flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
              >
                <BarChart3 className='h-4 w-4' />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='connections'
                className='flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
              >
                <Users className='h-4 w-4' />
                Connections
                {pendingRequests.length > 0 && (
                  <Badge className='gradient-primary text-primary-foreground border-0 ml-1 h-5 w-5 rounded-full p-0 text-xs'>
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value='chat'
                className='flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
              >
                <MessageSquare className='h-4 w-4' />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value='activity'
                className='flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
              >
                <Activity className='h-4 w-4' />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value='overview' className='space-y-8'>
              {loading ? (
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} lines={1} />
                  ))}
                </div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className='glass border-border/50 shadow-card'>
                      <CardHeader>
                        <CardTitle className='text-2xl font-heading'>
                          Welcome back, {user?.firstName} 👋
                        </CardTitle>
                        <CardDescription>
                          Here's what's happening in your developer network
                          today.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {[
                      {
                        icon: Users,
                        label: 'Connections',
                        value: String(myConnections.length),
                        color: 'from-primary to-primary/70',
                      },
                      {
                        icon: MessageCircle,
                        label: 'Active Chats',
                        value: '4',
                        color: 'from-accent to-accent/70',
                      },
                      {
                        icon: Code,
                        label: 'Projects',
                        value: '5',
                        color: 'from-primary to-accent',
                      },
                      {
                        icon: TrendingUp,
                        label: 'Profile Views',
                        value: '94',
                        color: 'from-accent to-primary',
                      },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className='glass border-border/50 shadow-card hover:shadow-card-hover transition-all'>
                          <CardContent className='pt-6'>
                            <div className='flex items-center gap-4'>
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                              >
                                <stat.icon className='h-5 w-5 text-primary-foreground' />
                              </div>
                              <div>
                                <p className='text-2xl font-heading font-bold'>
                                  {stat.value}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {stat.label}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className='grid gap-6 lg:grid-cols-2'>
                    <Card className='glass border-border/50 shadow-card'>
                      <CardHeader>
                        <CardTitle className='font-heading'>
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        {activities.slice(0, 4).map((a) => (
                          <div
                            key={a.id}
                            className='flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors'
                          >
                            <Avatar className='h-9 w-9'>
                              <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                                {a.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm'>{a.message}</p>
                              <p className='text-xs text-muted-foreground'>
                                {a.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className='glass border-border/50 shadow-card'>
                      <CardHeader>
                        <CardTitle className='font-heading'>
                          Trending Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        {trending.map((s) => (
                          <div
                            key={s.name}
                            className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors'
                          >
                            <div>
                              <span className='text-sm font-medium'>
                                {s.name}
                              </span>
                              <span className='text-xs text-muted-foreground ml-2'>
                                {s.projects} projects
                              </span>
                            </div>
                            <Badge variant='secondary' className='font-heading'>
                              {s.change}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Connections */}
            <TabsContent value='connections' className='space-y-6'>
              <Tabs defaultValue='discover' className='space-y-6'>
                <TabsList className='glass border border-border/50'>
                  <TabsTrigger value='discover'>Discover</TabsTrigger>
                  <TabsTrigger value='requests'>
                    Requests
                    {pendingRequests.length > 0 && (
                      <Badge className='ml-2 h-5 w-5 rounded-full p-0 text-xs gradient-primary text-primary-foreground border-0'>
                        {pendingRequests.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value='network'>My Network</TabsTrigger>
                </TabsList>

                <TabsContent value='discover' className='space-y-6'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 font-heading'>
                        <Search className='h-5 w-5' />
                        Discover Developers
                      </CardTitle>
                      <CardDescription>
                        Find and connect with developers who share your
                        interests
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex flex-col sm:flex-row gap-3'>
                        <div className='relative flex-1'>
                          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Search by name or skills...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-10'
                          />
                        </div>
                        <Select
                          value={skillFilter}
                          onValueChange={setSkillFilter}
                        >
                          <SelectTrigger className='w-[160px]'>
                            <SelectValue placeholder='Filter' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>All Skills</SelectItem>
                            {[
                              'React',
                              'Python',
                              'TypeScript',
                              'Go',
                              'Docker',
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {loading ? (
                        <SkeletonList count={4} />
                      ) : filteredDevs.length === 0 ? (
                        <EmptyState
                          icon={Users}
                          title='No developers found'
                          description='Try adjusting your search or filters.'
                        />
                      ) : (
                        <div className='grid gap-4 md:grid-cols-2'>
                          {filteredDevs.map((dev, i) => (
                            <motion.div
                              key={dev.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                            >
                              <Card className='glass border-border/50 hover:shadow-card-hover transition-all'>
                                <CardContent className='p-5'>
                                  <div className='flex items-start gap-3 mb-4'>
                                    <div className='relative'>
                                      <Avatar className='h-12 w-12 ring-2 ring-primary/10'>
                                        <AvatarFallback className='bg-primary/10 text-primary font-heading'>
                                          {dev.firstName[0]}
                                          {dev.lastName[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      {dev.isOnline && (
                                        <div className='absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500' />
                                      )}
                                    </div>
                                    <div className='min-w-0'>
                                      <Link
                                        to={`/profile/${dev.id}`}
                                        className='font-heading font-semibold hover:text-primary transition-colors'
                                      >
                                        {dev.firstName} {dev.lastName}
                                      </Link>
                                      <p className='text-sm text-muted-foreground truncate'>
                                        {dev.bio.slice(0, 60)}...
                                      </p>
                                    </div>
                                  </div>
                                  <div className='flex flex-wrap gap-1.5 mb-4'>
                                    {dev.skills.slice(0, 4).map((s) => (
                                      <Badge
                                        key={s}
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        {s}
                                      </Badge>
                                    ))}
                                    {dev.skills.length > 4 && (
                                      <Badge
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        +{dev.skills.length - 4}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button
                                      size='sm'
                                      className='gradient-primary border-0 flex-1 shadow-glow font-medium'
                                      onClick={() => handleConnect(dev.id)}
                                      disabled={sentRequestIds.has(dev.id)}
                                    >
                                      <UserPlus className='h-4 w-4 mr-1' />
                                      {sentRequestIds.has(dev.id)
                                        ? 'Pending'
                                        : 'Connect'}
                                    </Button>
                                    <Button size='sm' variant='outline' asChild>
                                      <Link to={`/profile/${dev.id}`}>
                                        View
                                      </Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value='requests' className='space-y-4'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 font-heading'>
                        <Clock className='h-5 w-5' />
                        Connection Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {pendingRequests.length === 0 ? (
                        <EmptyState
                          icon={UserCheck}
                          title='No pending requests'
                          description="You're all caught up!"
                        />
                      ) : (
                        pendingRequests.map((req) => {
                          const from = mockUsers.find(
                            (u) => u.id === req.fromUserId,
                          );
                          if (!from) return null;
                          return (
                            <Card
                              key={req.id}
                              className='glass border-l-4 border-l-primary'
                            >
                              <CardContent className='p-5'>
                                <div className='flex items-start justify-between flex-wrap gap-3'>
                                  <div className='flex items-start gap-3'>
                                    <Avatar className='h-12 w-12 ring-2 ring-primary/10'>
                                      <AvatarFallback className='bg-primary/10 text-primary font-heading'>
                                        {from.firstName[0]}
                                        {from.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className='font-heading font-semibold'>
                                        {from.firstName} {from.lastName}
                                      </h3>
                                      <p className='text-sm text-muted-foreground'>
                                        {from.email}
                                      </p>
                                      <div className='flex gap-1.5 mt-2'>
                                        {from.skills.slice(0, 3).map((s) => (
                                          <Badge
                                            key={s}
                                            variant='outline'
                                            className='text-xs'
                                          >
                                            {s}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button
                                      size='sm'
                                      className='gradient-primary border-0 shadow-glow'
                                      onClick={() => handleAccept(req.id)}
                                    >
                                      <UserCheck className='h-4 w-4 mr-1' />
                                      Accept
                                    </Button>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() => handleReject(req.id)}
                                    >
                                      <UserX className='h-4 w-4 mr-1' />
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value='network' className='space-y-4'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 font-heading'>
                        <UserCheck className='h-5 w-5' />
                        My Network ({myConnections.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {myConnections.length === 0 ? (
                        <EmptyState
                          icon={Users}
                          title='No connections yet'
                          description='Start discovering developers to grow your network.'
                        />
                      ) : (
                        <div className='grid gap-4 md:grid-cols-2'>
                          {myConnections.map((conn) => {
                            const otherId =
                              conn.fromUserId === user?.id
                                ? conn.toUserId
                                : conn.fromUserId;
                            const other = mockUsers.find(
                              (u) => u.id === otherId,
                            );
                            if (!other) return null;
                            return (
                              <Card
                                key={conn.id}
                                className='glass border-border/50 hover:shadow-card-hover transition-all'
                              >
                                <CardContent className='p-5'>
                                  <div className='flex items-start gap-3 mb-4'>
                                    <div className='relative'>
                                      <Avatar className='h-12 w-12 ring-2 ring-primary/10'>
                                        <AvatarFallback className='bg-primary/10 text-primary font-heading'>
                                          {other.firstName[0]}
                                          {other.lastName[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      {other.isOnline && (
                                        <div className='absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500' />
                                      )}
                                    </div>
                                    <div>
                                      <h3 className='font-heading font-semibold'>
                                        {other.firstName} {other.lastName}
                                      </h3>
                                      <p className='text-sm text-muted-foreground'>
                                        {other.email}
                                      </p>
                                      <div className='flex items-center gap-1 mt-1'>
                                        <Calendar className='h-3 w-3 text-muted-foreground' />
                                        <span className='text-xs text-muted-foreground'>
                                          Connected{' '}
                                          {new Date(
                                            conn.createdAt,
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex flex-wrap gap-1.5 mb-4'>
                                    {other.skills.slice(0, 3).map((s) => (
                                      <Badge
                                        key={s}
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='flex-1'
                                      asChild
                                    >
                                      <Link to={`/profile/${other.id}`}>
                                        View Profile
                                      </Link>
                                    </Button>
                                    <Button
                                      size='sm'
                                      className='gradient-primary border-0 flex-1 shadow-glow font-medium'
                                      asChild
                                    >
                                      <Link to='/chat'>
                                        <MessageCircle className='h-4 w-4 mr-1' />
                                        Message
                                      </Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Chat redirect */}
            <TabsContent value='chat'>
              <Card className='glass border-border/50 shadow-card'>
                <CardContent className='py-16'>
                  <EmptyState
                    icon={MessageSquare}
                    title='Chat has moved!'
                    description="We've given Chat its own dedicated page for a better experience."
                    action={
                      <Button
                        className='gradient-primary border-0 shadow-glow'
                        asChild
                      >
                        <Link to='/chat'>Go to Chat</Link>
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value='activity' className='space-y-6'>
              <Card className='glass border-border/50 shadow-card'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <Activity className='h-5 w-5' />
                    Connection Activity
                  </CardTitle>
                  <CardDescription>
                    Track all your connection activities, requests, and
                    interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {loading ? (
                    <SkeletonList count={5} />
                  ) : (
                    activities.map((a, i) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className='flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-border/30'
                      >
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                            {a.userName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <p className='text-sm font-medium font-heading'>
                            {a.title}
                          </p>
                          <p className='text-sm text-muted-foreground mt-0.5'>
                            {a.message}
                          </p>
                          <div className='flex items-center gap-2 mt-2'>
                            <Calendar className='h-3 w-3 text-muted-foreground' />
                            <span className='text-xs text-muted-foreground'>
                              {a.time}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            a.status === 'completed' ? 'default' : 'secondary'
                          }
                          className={
                            a.status === 'completed'
                              ? 'gradient-primary text-primary-foreground border-0'
                              : ''
                          }
                        >
                          {a.status === 'completed'
                            ? 'Done'
                            : a.status === 'pending'
                              ? 'Pending'
                              : 'Unread'}
                        </Badge>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </div>
  );
}
