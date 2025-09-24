import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


import {
  Bell,
  Settings,
  BarChart3,
  Users,
  MessageSquare,
  Code,
  Zap,
  TrendingUp,
  User,
  LogOut,
  Activity,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  GitBranch,
  Calendar,
} from 'lucide-react';
import { ConnectionsManager } from '@/components/Connection/ConnectionManager';
import { ChatSystem } from '@/components/Chat/ChatSystem';
import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '@/hooks/profile/useGetProfile';
import { useAppStore } from '@/store';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activityFilter, setActivityFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');

   const navigate = useNavigate();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProfile();

  // console.log("profileData", profileData);
  // console.log("isLoading", isLoading);
  // console.log("isError", isError);
  // console.log("error", error);
  // console.log("isFetching", isFetching);
  // console.log("refetch", refetch);

  const userProfileData = useAppStore((state) => state.userProfile);
  console.log("userProfileData", userProfileData);

  const { firstName, lastName, _id, emailId, photoUrl, skills, about } =
    userProfileData || {};

  const fullName = `${firstName || ''} ${lastName || ''}`.trim();

  const userStats = {
    connections: 24,
    projects: 8,
    contributions: 156,
    reputation: 4.8,
  };

  const allActivities = [
    {
      id: '1',
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: 'Emma Wilson accepted your connection request',
      time: '2 hours ago',
      date: '2024-01-15',
      avatar: '/developer-woman.png',
      user: 'Emma Wilson',
      status: 'completed',
    },
    {
      id: '2',
      type: 'connection_sent',
      title: 'Connection Request Sent',
      message: 'You sent a connection request to Alex Chen',
      time: '3 hours ago',
      date: '2024-01-15',
      avatar: '/developer-man.png',
      user: 'Alex Chen',
      status: 'pending',
    },
    {
      id: '3',
      type: 'connection_received',
      title: 'New Connection Request',
      message: 'Sarah Johnson wants to connect with you',
      time: '5 hours ago',
      date: '2024-01-15',
      avatar: '/developer-woman-2.jpg',
      user: 'Sarah Johnson',
      status: 'pending',
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'David Kim sent you a message about React project',
      time: '6 hours ago',
      date: '2024-01-15',
      avatar: '/developer-man-2.jpg',
      user: 'David Kim',
      status: 'unread',
    },
    {
      id: '5',
      type: 'collaboration',
      title: 'Collaboration Request',
      message: 'Lisa Park invited you to collaborate on Vue.js Dashboard',
      time: '1 day ago',
      date: '2024-01-14',
      avatar: '/developer-woman-3.jpg',
      user: 'Lisa Park',
      status: 'pending',
    },
    {
      id: '6',
      type: 'connection_rejected',
      title: 'Connection Declined',
      message: 'Your connection request to Mike Brown was declined',
      time: '2 days ago',
      date: '2024-01-13',
      avatar: '/developer-man.png',
      user: 'Mike Brown',
      status: 'declined',
    },
    {
      id: '7',
      type: 'profile_view',
      title: 'Profile Viewed',
      message: 'Jennifer Lee viewed your profile',
      time: '2 days ago',
      date: '2024-01-13',
      avatar: '/developer-woman.png',
      user: 'Jennifer Lee',
      status: 'viewed',
    },
    {
      id: '8',
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: 'Tom Wilson accepted your connection request',
      time: '3 days ago',
      date: '2024-01-12',
      avatar: '/developer-man-2.jpg',
      user: 'Tom Wilson',
      status: 'completed',
    },
  ];

  const filteredActivities = allActivities.filter((activity) => {
    const matchesFilter =
      activityFilter === 'all' || activity.type === activityFilter;
    const matchesSearch =
      activitySearch === '' ||
      activity.message.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.user.toLowerCase().includes(activitySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'connection_accepted':
        return <UserCheck className='h-4 w-4 text-green-600' />;
      case 'connection_sent':
        return <UserPlus className='h-4 w-4 text-blue-600' />;
      case 'connection_received':
        return <UserPlus className='h-4 w-4 text-orange-600' />;
      case 'connection_rejected':
        return <UserX className='h-4 w-4 text-red-600' />;
      case 'message':
        return <MessageCircle className='h-4 w-4 text-purple-600' />;
      case 'collaboration':
        return <GitBranch className='h-4 w-4 text-indigo-600' />;
      case 'profile_view':
        return <User className='h-4 w-4 text-gray-600' />;
      default:
        return <Activity className='h-4 w-4 text-gray-600' />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant='default' className='bg-orange-100 text-orange-800'>
            Pending
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant='default' className='bg-red-100 text-red-800'>
            Declined
          </Badge>
        );
      case 'unread':
        return (
          <Badge variant='default' className='bg-blue-100 text-blue-800'>
            Unread
          </Badge>
        );
      case 'viewed':
        return (
          <Badge variant='default' className='bg-gray-100 text-gray-800'>
            Viewed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleProfileClick = () => {

    navigate('/profile');
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-sm'>
                  DC
                </span>
              </div>
              <h1 className='text-xl font-semibold'>Dashboard</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon'>
                <Bell className='h-5 w-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <Settings className='h-5 w-5' />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={photoUrl} />
                      <AvatarFallback>{firstName[0]+lastName[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {fullName}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {emailId}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className='mr-2 h-4 w-4' />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className='mr-2 h-4 w-4' />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-red-600'>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-4 lg:w-[600px]'>
            <TabsTrigger value='overview' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='connections'
              className='flex items-center gap-2'
            >
              <Users className='h-4 w-4' />
              Connections
            </TabsTrigger>
            <TabsTrigger value='chat' className='flex items-center gap-2'>
              <MessageSquare className='h-4 w-4' />
              Chat
            </TabsTrigger>
            <TabsTrigger value='activity' className='flex items-center gap-2'>
              <Activity className='h-4 w-4' />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Welcome back, {firstName}</CardTitle>
                <CardDescription>
                  Here's what's happening in your developer network today.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Connections
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {userStats.connections}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    <span className='text-green-600'>+3</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Projects
                  </CardTitle>
                  <Code className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{userStats.projects}</div>
                  <p className='text-xs text-muted-foreground'>
                    <span className='text-green-600'>+2</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Contributions
                  </CardTitle>
                  <Zap className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {userStats.contributions}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    <span className='text-green-600'>+12</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Reputation
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {userStats.reputation}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    <span className='text-green-600'>+0.2</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest interactions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {allActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className='flex items-center space-x-3'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={activity.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm'>{activity.message}</p>
                        <p className='text-xs text-muted-foreground'>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Users className='h-4 w-4 mr-2' />
                    Find New Connections
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Code className='h-4 w-4 mr-2' />
                    Start New Project
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <MessageSquare className='h-4 w-4 mr-2' />
                    Send Message
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Settings className='h-4 w-4 mr-2' />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='connections'>
            <ConnectionsManager />
          </TabsContent>

          <TabsContent value='chat'>
            <ChatSystem />
          </TabsContent>

          <TabsContent value='activity' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Connection Activity
                </CardTitle>
                <CardDescription>
                  Track all your connection activities, requests, and
                  interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                  <div className='flex-1'>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <Input
                        placeholder='Search activities...'
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        className='pl-10'
                      />
                    </div>
                  </div>
                  <Select
                    value={activityFilter}
                    onValueChange={setActivityFilter}
                  >
                    <SelectTrigger className='w-full sm:w-[200px]'>
                      <Filter className='h-4 w-4 mr-2' />
                      <SelectValue placeholder='Filter by type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Activities</SelectItem>
                      <SelectItem value='connection_accepted'>
                        Accepted
                      </SelectItem>
                      <SelectItem value='connection_sent'>
                        Sent Requests
                      </SelectItem>
                      <SelectItem value='connection_received'>
                        Received Requests
                      </SelectItem>
                      <SelectItem value='connection_rejected'>
                        Declined
                      </SelectItem>
                      <SelectItem value='message'>Messages</SelectItem>
                      <SelectItem value='collaboration'>
                        Collaborations
                      </SelectItem>
                      <SelectItem value='profile_view'>
                        Profile Views
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-4'>
                  {filteredActivities.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      <Activity className='h-12 w-12 mx-auto mb-4 opacity-50' />
                      <p>No activities found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className='flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors'
                      >
                        <div className='flex-shrink-0'>
                          {getActivityIcon(activity.type)}
                        </div>
                        <Avatar className='h-10 w-10 flex-shrink-0'>
                          <AvatarImage
                            src={activity.avatar || '/placeholder.svg'}
                          />
                          <AvatarFallback>
                            {activity.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-foreground'>
                                {activity.title}
                              </p>
                              <p className='text-sm text-muted-foreground mt-1'>
                                {activity.message}
                              </p>
                              <div className='flex items-center gap-2 mt-2'>
                                <Calendar className='h-3 w-3 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>
                                  {activity.time}
                                </span>
                              </div>
                            </div>
                            <div className='flex items-center gap-2 ml-4'>
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className='mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='text-center p-4 rounded-lg bg-muted/50'>
                    <div className='text-2xl font-bold text-green-600'>
                      {
                        allActivities.filter(
                          (a) => a.type === 'connection_accepted'
                        ).length
                      }
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Accepted
                    </div>
                  </div>
                  <div className='text-center p-4 rounded-lg bg-muted/50'>
                    <div className='text-2xl font-bold text-orange-600'>
                      {
                        allActivities.filter((a) => a.status === 'pending')
                          .length
                      }
                    </div>
                    <div className='text-sm text-muted-foreground'>Pending</div>
                  </div>
                  <div className='text-center p-4 rounded-lg bg-muted/50'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {allActivities.filter((a) => a.type === 'message').length}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Messages
                    </div>
                  </div>
                  <div className='text-center p-4 rounded-lg bg-muted/50'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {
                        allActivities.filter((a) => a.type === 'collaboration')
                          .length
                      }
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Collaborations
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
