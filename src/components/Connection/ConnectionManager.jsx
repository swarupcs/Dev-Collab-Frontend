
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus, UserCheck, UserX, Clock, MapPin, Star, Github, Linkedin, Globe } from "lucide-react"
import { useSendConnection } from "@/hooks/connection/useSendConnection"
import { useGetPendingConnectionRequests } from "@/hooks/connection/getPendingConnectionRequests"


export function ConnectionsManager({ suggestedRequestData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // console.log('suggestedRequestData', suggestedRequestData);

  // Use the existing mutation hook with user removal callback

  // Mock data for developer discovery
  const suggestedDevelopers = [
    {
      id: '1',
      name: 'Maria Garcia',
      username: '@mariagarcia',
      avatar: '/developer-woman.png',
      skills: ['React', 'TypeScript', 'GraphQL', 'AWS'],
      location: 'San Francisco, CA',
      bio: 'Full-stack developer passionate about building scalable web applications',
      experience: '5+ years',
      rating: 4.8,
      projects: 23,
      connections: 156,
      status: 'online',
      github: 'mariagarcia',
      linkedin: 'maria-garcia-dev',
    },
    {
      id: '2',
      name: 'James Thompson',
      username: '@jamesthompson',
      avatar: '/developer-man.png',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      location: 'New York, NY',
      bio: 'Backend engineer with expertise in distributed systems and microservices',
      experience: '7+ years',
      rating: 4.9,
      projects: 31,
      connections: 203,
      status: 'offline',
      github: 'jamesthompson',
      website: 'jamesthompson.dev',
    },
    {
      id: '3',
      name: 'Priya Patel',
      username: '@priyapatel',
      avatar: '/developer-woman-2.jpg',
      skills: ['Flutter', 'Dart', 'Firebase', 'iOS'],
      location: 'London, UK',
      bio: 'Mobile app developer creating beautiful cross-platform experiences',
      experience: '4+ years',
      rating: 4.7,
      projects: 18,
      connections: 89,
      status: 'online',
      github: 'priyapatel',
      linkedin: 'priya-patel-mobile',
    },
    {
      id: '4',
      name: 'Carlos Rodriguez',
      username: '@carlosrodriguez',
      avatar: '/developer-man-2.jpg',
      skills: ['Vue.js', 'Nuxt.js', 'Node.js', 'MongoDB'],
      location: 'Barcelona, Spain',
      bio: 'Frontend specialist with a passion for user experience and performance',
      experience: '6+ years',
      rating: 4.6,
      projects: 27,
      connections: 134,
      status: 'online',
      linkedin: 'carlos-rodriguez-frontend',
      website: 'carlosdev.es',
    },
  ];

  const connectionRequests = [
    {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahdev',
      avatar: '/developer-woman-3.jpg',
      skills: ['React', 'TypeScript', 'Node.js'],
      mutualConnections: 5,
      requestDate: '2 days ago',
      message:
        'Hi! I saw your work on the React component library. Would love to connect and discuss best practices!',
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      username: '@alexcodes',
      avatar: '/user-profile-illustration.png',
      skills: ['Python', 'Django', 'PostgreSQL'],
      mutualConnections: 3,
      requestDate: '1 week ago',
      message:
        "Hello! I'm working on a similar project and would appreciate your insights.",
    },
  ];

  const myConnections = [
    {
      id: '1',
      name: 'Emma Wilson',
      username: '@emmawilson',
      avatar: '/developer-woman.png',
      skills: ['Vue.js', 'Laravel', 'MySQL'],
      location: 'Toronto, Canada',
      bio: 'Full-stack developer and open source contributor',
      experience: '5+ years',
      rating: 4.8,
      projects: 19,
      connections: 98,
      status: 'online',
      github: 'emmawilson',
    },
    {
      id: '2',
      name: 'David Kim',
      username: '@davidkim',
      avatar: '/developer-man.png',
      skills: ['Go', 'Docker', 'Kubernetes'],
      location: 'Seoul, South Korea',
      bio: 'DevOps engineer specializing in cloud infrastructure',
      experience: '8+ years',
      rating: 4.9,
      projects: 34,
      connections: 187,
      status: 'offline',
      github: 'davidkim',
      linkedin: 'david-kim-devops',
    },
  ];

  // Add state to track processed users (connected or ignored)
  const [processedSuggestUsers, setProcessedSuggestUsers] = useState(new Set());

  const { mutate, isLoading } = useSendConnection({
    onSuccess: (data, variables) => {
      // Remove user from list after successful API call
      setProcessedSuggestUsers((prev) => new Set(prev).add(variables.toUserId));
    },
  });
  const handleSendConnectionRequest = (developerId) => {
    // console.log('[v0] Sending connection request to:', developerId);
    mutate({ status: 'interested', toUserId: developerId });
    // Handle connection request logic here
  };

  const handleIgnoreUser = (developerId) => {
    // console.log('[v0] Ignoring user:', developerId);
    mutate({ status: 'ignored', toUserId: developerId });
    // Handle ignore logic here
  };

  const filteredDevelopers = suggestedRequestData.filter((dev) => {
    // First filter out users who have been processed (connected or ignored)
    if (processedSuggestUsers.has(dev._id)) {
      return false;
    }

    const fullName = `${dev.firstName} ${dev.lastName}`.toLowerCase();
    const email = dev.emailId.toLowerCase();
    const searchTerm = searchQuery.toLowerCase();

    // Check if search matches name, email, or skills
    const matchesSearch =
      fullName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      (dev.skills &&
        dev.skills.length > 0 &&
        dev.skills.some((skill) => skill.toLowerCase().includes(searchTerm)));

    // Check if skill filter matches (only if skills array exists and has items)
    const matchesSkill =
      skillFilter === 'all' ||
      (dev.skills && dev.skills.length > 0 && dev.skills.includes(skillFilter));

    return matchesSearch && matchesSkill;
  });


  const [processedRequests, setProcessedRequests] = useState(new Set());
  const { mutate: reviewMutate, isLoading: reviewIsLoading } = useSendConnection({
    onSuccess: (data, variables) => {
      // Remove request from list after successful API call
      setProcessedRequests((prev) => new Set(prev).add(variables.requestId));
    }
  });

  const handleAcceptRequest = (requestId) => {
    // console.log('[v0] Accepting connection request:', requestId);
    reviewMutate({ status: 'accepted', requestId });
    // Handle accept logic here
  };

  const handleRejectRequest = (requestId) => {
    // console.log('[v0] Rejecting connection request:', requestId);
    reviewMutate({ status: 'rejected', requestId });
    // Handle reject logic here
  };

  const {
    data: pendingRequests,
    isLoading: pendingRequestLoading,
    error,
    refetch,
  } = useGetPendingConnectionRequests();

  const pendingRequestData = pendingRequests?.data?.requests || [];

  console.log('pendingRequestMutate', pendingRequests);

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='discover' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='discover'>Discover</TabsTrigger>
          <TabsTrigger value='requests'>
            Requests
            {connectionRequests.length > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 h-5 w-5 rounded-full p-0 text-xs'
              >
                {connectionRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='connections'>My Network</TabsTrigger>
        </TabsList>

        {/* Discover Developers */}
        <TabsContent value='discover' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Search className='h-5 w-5' />
                Discover Developers
              </CardTitle>
              <CardDescription>
                Find and connect with developers who share your interests
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Search and Filters */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search by name or skills...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Filter by skill' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Skills</SelectItem>
                    <SelectItem value='React'>React</SelectItem>
                    <SelectItem value='Python'>Python</SelectItem>
                    <SelectItem value='TypeScript'>TypeScript</SelectItem>
                    <SelectItem value='Flutter'>Flutter</SelectItem>
                    <SelectItem value='Vue.js'>Vue.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Developer Cards */}
              <div className='grid gap-4 md:grid-cols-2'>
                {filteredDevelopers.map((developer) => (
                  <Card
                    key={developer._id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='relative'>
                            <Avatar className='h-12 w-12'>
                              <AvatarImage
                                src={developer.photoUrl || '/placeholder.svg'}
                              />
                              <AvatarFallback>
                                {developer.firstName[0]}
                                {developer.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <h3 className='font-semibold'>
                              {developer.firstName} {developer.lastName}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              {developer.emailId}
                            </p>
                          </div>
                        </div>
                      </div>

                      {developer.skills && developer.skills.length > 0 ? (
                        <div className='flex flex-wrap gap-1 mb-3'>
                          {developer.skills.slice(0, 4).map((skill, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='text-xs'
                            >
                              {skill}
                            </Badge>
                          ))}
                          {developer.skills.length > 4 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{developer.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className='mb-3'>
                          <p className='text-sm text-muted-foreground'>
                            No skills listed
                          </p>
                        </div>
                      )}

                      <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                          {/* Social links can be added here if available in data */}
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            onClick={() =>
                              handleSendConnectionRequest(developer._id)
                            }
                            disabled={isLoading}
                          >
                            <UserPlus className='h-4 w-4 mr-1' />
                            Connect
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleIgnoreUser(developer._id)}
                            disabled={isLoading}
                          >
                            <UserX className='h-4 w-4 mr-1' />
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show message when no developers are available */}
              {filteredDevelopers.length === 0 && (
                <div className='text-center py-8'>
                  <p className='text-muted-foreground'>
                    No developers found matching your criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Requests */}
        <TabsContent value='requests' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Connection Requests
              </CardTitle>
              <CardDescription>
                Developers who want to connect with you
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {pendingRequestData.length === 0 ? (
                <div className='text-center py-8'>
                  <Clock className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-medium mb-2'>
                    No pending requests
                  </h3>
                  <p className='text-muted-foreground'>You're all caught up!</p>
                </div>
              ) : (
                pendingRequestData.map((request) => (
                  <Card
                    key={request._id}
                    className='border-l-4 border-l-primary'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start space-x-4'>
                          <Avatar className='h-12 w-12'>
                            <AvatarImage
                              src={
                                request.fromUserId.photoUrl ||
                                '/placeholder.svg'
                              }
                            />
                            <AvatarFallback>
                              {`${request.fromUserId.firstName} ${request.fromUserId.lastName}`
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <h3 className='font-semibold'>
                              {`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              {request.fromUserId.emailId}
                            </p>
                            <div className='flex gap-1 mt-2'>
                              {request.fromUserId.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant='outline'
                                  className='text-xs'
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <p className='text-xs text-muted-foreground mt-2'>
                              Status: {request.status} •{' '}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            {request.message && (
                              <div className='mt-3 p-3 bg-muted rounded-lg'>
                                <p className='text-sm'>{request.message}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            onClick={() => handleAcceptRequest(request._id)}
                          >
                            <UserCheck className='h-4 w-4 mr-1' />
                            Accept
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleRejectRequest(request._id)}
                          >
                            <UserX className='h-4 w-4 mr-1' />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Connections */}
        <TabsContent value='connections' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <UserCheck className='h-5 w-5' />
                My Network
              </CardTitle>
              <CardDescription>
                Your developer connections ({myConnections.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search your connections...'
                  className='pl-10'
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                {myConnections.map((connection) => (
                  <Card
                    key={connection.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='relative'>
                            <Avatar className='h-12 w-12'>
                              <AvatarImage
                                src={connection.avatar || '/placeholder.svg'}
                              />
                              <AvatarFallback>
                                {connection.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                                connection.status === 'online'
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                              }`}
                            />
                          </div>
                          <div>
                            <h3 className='font-semibold'>{connection.name}</h3>
                            <p className='text-sm text-muted-foreground'>
                              {connection.username}
                            </p>
                            <div className='flex items-center gap-1 mt-1'>
                              <MapPin className='h-3 w-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                {connection.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-medium'>
                            {connection.rating}
                          </span>
                        </div>
                      </div>

                      <p className='text-sm text-muted-foreground mb-3'>
                        {connection.bio}
                      </p>

                      <div className='flex flex-wrap gap-1 mb-3'>
                        {connection.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant='outline'
                            className='text-xs'
                          >
                            {skill}
                          </Badge>
                        ))}
                        {connection.skills.length > 3 && (
                          <Badge variant='outline' className='text-xs'>
                            +{connection.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                          {connection.github && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0'
                            >
                              <Github className='h-4 w-4' />
                            </Button>
                          )}
                          {connection.linkedin && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0'
                            >
                              <Linkedin className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                        <Button size='sm' variant='outline'>
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
