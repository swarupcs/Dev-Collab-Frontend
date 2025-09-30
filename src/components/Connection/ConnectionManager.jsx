import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  Star,
  Github,
  Linkedin,
  Globe,
  Calendar,
} from 'lucide-react';
import { useSendConnection } from '@/hooks/connection/useSendConnection';
import { useGetPendingConnectionRequests } from '@/hooks/connection/getPendingConnectionRequests';
import { useReviewConnectionRequest } from '@/hooks/connection/useReviewConnectionRequest';
import { useGetMyConnections } from '@/hooks/connection/getMyConnections';

export function ConnectionsManager({ suggestedRequestData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

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

  const {
    data: pendingRequests,
    isLoading: pendingRequestLoading,
    error,
    refetch,
  } = useGetPendingConnectionRequests();

  console.log('pendingRequests', pendingRequests);

  const [pendingRequestData, setPendingRequestData] = useState(
    pendingRequests?.data?.requests || []
  );

  useEffect(() => {
    if (pendingRequests?.data?.requests) {
      setPendingRequestData(pendingRequests.data.requests);
    }
  }, [pendingRequests]);

  console.log('pendingRequestData', pendingRequestData);

  const [processedReviewRequests, setProcessedReviewRequests] = useState(
    new Set()
  );
const { mutate: reviewMutate, isLoading: reviewIsLoading } =
  useReviewConnectionRequest({
    onSuccess: (data, variables) => {
      // Update pendingRequestData by removing the processed request
      setPendingRequestData((prevData) =>
        prevData.filter((request) => request._id !== variables.requestId)
      );

      // Refetch connections if request was accepted
      if (variables.status === 'accepted') {
        refetchUserConnections();
      }
    },
  });

  const {
    data: userConnections,
    isLoading: userConnectionsLoading,
    error: userConnectionsError,
    isError,
    refetch: refetchUserConnections,
  } = useGetMyConnections();


const handleAcceptRequest = (requestId) => {
  console.log('[v0] Accepting connection request:', requestId);
  reviewMutate({ status: 'accepted', requestId });
};

const handleRejectRequest = (requestId) => {
  console.log('[v0] Rejecting connection request:', requestId);
  reviewMutate({ status: 'rejected', requestId });
};

  const [userConnectionsData, setUserConnectionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userConnections?.data?.connections) {
      setUserConnectionsData(userConnections.data.connections);
    }
  }, [userConnections]);
  // console.log("userConnectionsData", userConnectionsData);

  // Filter connections based on search term
  const filteredConnections = userConnectionsData.filter(
    (connection) =>
      `${connection.connectedUser.firstName} ${connection.connectedUser.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      connection.connectedUser.emailId
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (userConnectionsLoading) {
    return (
      <TabsContent value='connections' className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserCheck className='h-5 w-5' />
              My Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
                <p>Loading your connections...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  if (isError) {
    return (
      <TabsContent value='connections' className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserCheck className='h-5 w-5' />
              My Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-8'>
              <p className='text-red-500 mb-4'>
                Error:{' '}
                {userConnectionsError?.message || 'Failed to load connections'}
              </p>
              <Button onClick={() => refetchUserConnections()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  // console.log('pendingRequestMutate', pendingRequests);

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='discover' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='discover'>Discover</TabsTrigger>
          <TabsTrigger value='requests'>
            Requests
            {pendingRequestData.length > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 h-5 w-5 rounded-full p-0 text-xs'
              >
                {pendingRequestData.length}
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
                Your developer connections ({filteredConnections.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search your connections...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredConnections.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-muted-foreground'>
                    {searchTerm
                      ? 'No connections found matching your search.'
                      : 'No connections found.'}
                  </p>
                </div>
              ) : (
                <div className='grid gap-4 md:grid-cols-2'>
                  {filteredConnections.map((connection) => {
                    const user = connection.connectedUser;
                    const fullName = `${user.firstName} ${user.lastName}`;
                    const initials = `${user.firstName[0]}${user.lastName[0]}`;

                    return (
                      <Card
                        key={connection._id}
                        className='hover:shadow-md transition-shadow'
                      >
                        <CardContent className='p-6'>
                          <div className='flex items-start justify-between mb-4'>
                            <div className='flex items-center space-x-3'>
                              <div className='relative'>
                                <Avatar className='h-12 w-12'>
                                  <AvatarImage
                                    src={user.photoUrl || '/placeholder.svg'}
                                    alt={fullName}
                                  />
                                  <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                {/* You can add online status if available in your data */}
                                <div className='absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-gray-400' />
                              </div>
                              <div>
                                <h3 className='font-semibold'>{fullName}</h3>
                                <p className='text-sm text-muted-foreground'>
                                  {user.emailId}
                                </p>
                                <div className='flex items-center gap-1 mt-1'>
                                  <Calendar className='h-3 w-3 text-muted-foreground' />
                                  <span className='text-xs text-muted-foreground'>
                                    Connected{' '}
                                    {new Date(
                                      connection.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Rating section - you can remove this if not available */}
                            {/* <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-medium'>
                            {connection.rating || 'N/A'}
                          </span>
                        </div> */}
                          </div>

                          {/* Bio section - you can add this if available in your data */}
                          {user.bio && (
                            <p className='text-sm text-muted-foreground mb-3'>
                              {user.bio}
                            </p>
                          )}

                          {/* Skills section */}
                          {user.skills && user.skills.length > 0 && (
                            <div className='flex flex-wrap gap-1 mb-3'>
                              {user.skills.slice(0, 3).map((skill, index) => (
                                <Badge
                                  key={`${skill}-${index}`}
                                  variant='outline'
                                  className='text-xs'
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {user.skills.length > 3 && (
                                <Badge variant='outline' className='text-xs'>
                                  +{user.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                              {/* Social links - add these if available in your data */}
                              {user.github && (
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                  onClick={() =>
                                    window.open(user.github, '_blank')
                                  }
                                >
                                  <Github className='h-4 w-4' />
                                </Button>
                              )}
                              {user.linkedin && (
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                  onClick={() =>
                                    window.open(user.linkedin, '_blank')
                                  }
                                >
                                  <Linkedin className='h-4 w-4' />
                                </Button>
                              )}
                            </div>
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => {
                                // Navigate to user profile or handle view profile action
                                console.log('View profile for:', user._id);
                              }}
                            >
                              View Profile
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
    </div>
  );
}
