// ============================================================
// Mock Data Layer — All datasets used across the application
// ============================================================

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  twitter: string;
  skills: string[];
  joinedDate: string;
  isOnline: boolean;
  visibility: 'public' | 'private';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  openRoles: string[];
  ownerId: string;
  members: string[];
  applicants: string[];
  invitations: ProjectInvitation[];
  collaborationRequests: CollaborationRequest[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  createdAt: string;
}

export interface ProjectInvitation {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  timestamp: string;
  reactions: { emoji: string; userId: string }[];
}

export interface Notification {
  id: string;
  type: 'connection' | 'message' | 'project' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId?: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'connection_accepted'
    | 'connection_sent'
    | 'message'
    | 'collaboration'
    | 'project_created'
    | 'profile_view';
  title: string;
  message: string;
  time: string;
  userName: string;
  status: 'completed' | 'pending' | 'unread';
}

// ---- Mock Users ----
export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    firstName: 'Alex',
    lastName: 'Dev',
    email: 'alex@devcollab.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'Full-stack developer passionate about open source, clean architecture, and building tools that help developers collaborate better.',
    location: 'San Francisco, CA',
    website: 'https://alexdev.io',
    github: 'alexdev',
    twitter: 'alexdev',
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Go',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GraphQL',
    ],
    joinedDate: '2024-12-01',
    isOnline: true,
    visibility: 'public',
  },
  {
    id: 'u2',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'Frontend architect specializing in React ecosystems and design systems. Love mentoring junior devs.',
    location: 'New York, NY',
    website: 'https://sarahchen.dev',
    github: 'sarahchen',
    twitter: 'sarahchendev',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Figma',
      'Tailwind CSS',
      'Storybook',
    ],
    joinedDate: '2024-10-15',
    isOnline: true,
    visibility: 'public',
  },
  {
    id: 'u3',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'Backend engineer & cloud architect. Building scalable systems at scale. AWS certified.',
    location: 'Austin, TX',
    website: '',
    github: 'marcusj',
    twitter: '',
    skills: ['Python', 'Django', 'AWS', 'Terraform', 'Kubernetes', 'Redis'],
    joinedDate: '2024-11-20',
    isOnline: false,
    visibility: 'public',
  },
  {
    id: 'u4',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    email: 'elena@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'Mobile & cross-platform developer. Building delightful user experiences with Flutter and React Native.',
    location: 'Barcelona, Spain',
    website: 'https://elena.dev',
    github: 'elenarodriguez',
    twitter: 'elena_dev',
    skills: [
      'Vue.js',
      'GraphQL',
      'Docker',
      'Flutter',
      'React Native',
      'Firebase',
    ],
    joinedDate: '2024-09-05',
    isOnline: true,
    visibility: 'public',
  },
  {
    id: 'u5',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'ML engineer and data scientist. Turning data into products. Open source contributor.',
    location: 'Seoul, South Korea',
    website: '',
    github: 'davidkim',
    twitter: 'davidkim_ml',
    skills: [
      'Python',
      'TensorFlow',
      'PyTorch',
      'FastAPI',
      'PostgreSQL',
      'Docker',
    ],
    joinedDate: '2024-08-10',
    isOnline: false,
    visibility: 'public',
  },
  {
    id: 'u6',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'DevOps engineer automating everything. Infrastructure as code enthusiast.',
    location: 'Mumbai, India',
    website: 'https://priyasharma.io',
    github: 'priyasharma',
    twitter: '',
    skills: ['Kubernetes', 'Terraform', 'Go', 'AWS', 'CI/CD', 'Prometheus'],
    joinedDate: '2024-07-22',
    isOnline: true,
    visibility: 'public',
  },
  {
    id: 'u7',
    firstName: 'Tom',
    lastName: 'Wilson',
    email: 'tom@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'Full-stack Java developer with 8 years of experience. Spring Boot expert.',
    location: 'London, UK',
    website: '',
    github: 'tomwilson',
    twitter: 'tomwilsondev',
    skills: [
      'Java',
      'Spring Boot',
      'Microservices',
      'PostgreSQL',
      'RabbitMQ',
      'React',
    ],
    joinedDate: '2024-06-18',
    isOnline: false,
    visibility: 'public',
  },
  {
    id: 'u8',
    firstName: 'Lisa',
    lastName: 'Park',
    email: 'lisa@dev.io',
    password: 'password123',
    avatarUrl: '',
    bio: 'UX engineer bridging the gap between design and code. Accessibility advocate.',
    location: 'Toronto, Canada',
    website: 'https://lisapark.design',
    github: 'lisapark',
    twitter: 'lisaparkux',
    skills: [
      'React',
      'Figma',
      'CSS',
      'Accessibility',
      'Design Systems',
      'TypeScript',
    ],
    joinedDate: '2024-05-30',
    isOnline: true,
    visibility: 'public',
  },
];

// ---- Projects ----
export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'DevBoard — Developer Dashboard',
    description:
      'An open-source developer dashboard with GitHub integration, CI/CD status, and team metrics. Real-time data visualization.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL'],
    openRoles: ['Backend Developer', 'DevOps Engineer'],
    ownerId: 'u1',
    members: ['u1', 'u2', 'u8'],
    applicants: ['u3'],
    invitations: [
      {
        id: 'inv1',
        userId: 'u6',
        projectId: 'p1',
        role: 'DevOps Engineer',
        status: 'pending',
        createdAt: '2025-01-25',
      },
    ],
    collaborationRequests: [
      {
        id: 'collab1',
        userId: 'u3',
        projectId: 'p1',
        role: 'Backend Developer',
        message:
          'I have extensive experience with Node.js and would love to contribute to the backend.',
        status: 'pending',
        createdAt: '2025-01-20',
      },
      {
        id: 'collab2',
        userId: 'u7',
        projectId: 'p1',
        role: 'Backend Developer',
        message:
          'Java/Spring expert here — can help with microservices architecture.',
        status: 'accepted',
        createdAt: '2025-01-15',
      },
    ],
    status: 'active',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-28',
  },
  {
    id: 'p2',
    title: 'CodeMentor AI',
    description:
      'AI-powered code review and mentoring platform. Get instant feedback on your code quality, security, and performance.',
    techStack: ['Python', 'FastAPI', 'React', 'TensorFlow', 'Docker'],
    openRoles: ['ML Engineer', 'Frontend Developer'],
    ownerId: 'u5',
    members: ['u5', 'u3'],
    applicants: [],
    invitations: [],
    collaborationRequests: [
      {
        id: 'collab3',
        userId: 'u2',
        projectId: 'p2',
        role: 'Frontend Developer',
        message: 'React specialist — would love to build the dashboard UI.',
        status: 'pending',
        createdAt: '2025-01-22',
      },
    ],
    status: 'active',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-25',
  },
  {
    id: 'p3',
    title: 'CloudDeploy',
    description:
      'One-click deployment platform for microservices. Supports Docker, Kubernetes, and serverless architectures.',
    techStack: ['Go', 'Kubernetes', 'Terraform', 'React', 'AWS'],
    openRoles: ['Go Developer'],
    ownerId: 'u6',
    members: ['u6', 'u7', 'u1'],
    applicants: ['u4'],
    invitations: [],
    collaborationRequests: [
      {
        id: 'collab4',
        userId: 'u4',
        projectId: 'p3',
        role: 'Go Developer',
        message: 'Cross-platform deployment is my expertise!',
        status: 'pending',
        createdAt: '2025-01-18',
      },
    ],
    status: 'active',
    createdAt: '2024-12-20',
    updatedAt: '2025-01-20',
  },
  {
    id: 'p4',
    title: 'DesignKit',
    description:
      'A comprehensive React component library with accessibility-first approach. Includes 50+ components with Storybook docs.',
    techStack: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS', 'Figma'],
    openRoles: [],
    ownerId: 'u8',
    members: ['u8', 'u2', 'u4'],
    applicants: [],
    invitations: [],
    collaborationRequests: [
      {
        id: 'collab5',
        userId: 'u1',
        projectId: 'p4',
        role: 'Contributor',
        message: 'I would love to help with TypeScript types.',
        status: 'closed',
        createdAt: '2024-12-01',
      },
    ],
    status: 'completed',
    createdAt: '2024-11-01',
    updatedAt: '2025-01-15',
  },
  {
    id: 'p5',
    title: 'DataPipeline Pro',
    description:
      'Scalable ETL pipeline framework with real-time monitoring and alerting. Process millions of events per second.',
    techStack: ['Python', 'Apache Kafka', 'PostgreSQL', 'Redis', 'Docker'],
    openRoles: ['Data Engineer', 'Backend Developer'],
    ownerId: 'u3',
    members: ['u3', 'u5'],
    applicants: ['u7'],
    invitations: [
      {
        id: 'inv2',
        userId: 'u1',
        projectId: 'p5',
        role: 'Backend Developer',
        status: 'pending',
        createdAt: '2025-01-27',
      },
    ],
    collaborationRequests: [
      {
        id: 'collab6',
        userId: 'u7',
        projectId: 'p5',
        role: 'Backend Developer',
        message: 'Spring + Kafka is my forte. Happy to help.',
        status: 'pending',
        createdAt: '2025-01-26',
      },
    ],
    status: 'active',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-30',
  },
];

// ---- Connection Requests ----
export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'cr1',
    fromUserId: 'u7',
    toUserId: 'u1',
    status: 'pending',
    createdAt: '2025-01-28',
  },
  {
    id: 'cr2',
    fromUserId: 'u5',
    toUserId: 'u1',
    status: 'pending',
    createdAt: '2025-01-26',
  },
  {
    id: 'cr3',
    fromUserId: 'u1',
    toUserId: 'u2',
    status: 'accepted',
    createdAt: '2025-01-10',
  },
  {
    id: 'cr4',
    fromUserId: 'u1',
    toUserId: 'u6',
    status: 'accepted',
    createdAt: '2025-01-05',
  },
  {
    id: 'cr5',
    fromUserId: 'u4',
    toUserId: 'u1',
    status: 'accepted',
    createdAt: '2024-12-20',
  },
  {
    id: 'cr6',
    fromUserId: 'u8',
    toUserId: 'u1',
    status: 'accepted',
    createdAt: '2024-12-15',
  },
];

// ---- Chat Conversations ----
export const mockConversations: ChatConversation[] = [
  {
    id: 'conv1',
    participantIds: ['u1', 'u2'],
    lastMessage: 'Hey! Want to collaborate on the dashboard?',
    lastMessageTime: '2m ago',
    unread: 2,
  },
  {
    id: 'conv2',
    participantIds: ['u1', 'u6'],
    lastMessage: 'The deploy pipeline is ready for review.',
    lastMessageTime: '1h ago',
    unread: 0,
  },
  {
    id: 'conv3',
    participantIds: ['u1', 'u4'],
    lastMessage: 'The mobile build was successful! 🎉',
    lastMessageTime: '3h ago',
    unread: 0,
  },
  {
    id: 'conv4',
    participantIds: ['u1', 'u8'],
    lastMessage: 'Check out the new component library.',
    lastMessageTime: '1d ago',
    unread: 1,
  },
];

// ---- Chat Messages ----
export const mockMessages: Record<string, ChatMessage[]> = {
  conv1: [
    {
      id: 'm1',
      conversationId: 'conv1',
      senderId: 'u2',
      message: 'Hey! I saw your DevBoard project, looks amazing!',
      timestamp: '10:30 AM',
      reactions: [],
    },
    {
      id: 'm2',
      conversationId: 'conv1',
      senderId: 'u1',
      message: "Thanks! I've been working on the real-time data module.",
      timestamp: '10:32 AM',
      reactions: [{ emoji: '👍', userId: 'u2' }],
    },
    {
      id: 'm3',
      conversationId: 'conv1',
      senderId: 'u2',
      message: 'Would you like to collaborate on the auth system?',
      timestamp: '10:33 AM',
      reactions: [],
    },
    {
      id: 'm4',
      conversationId: 'conv1',
      senderId: 'u1',
      message: 'Absolutely! Let me share the repo link with you.',
      timestamp: '10:35 AM',
      reactions: [],
    },
    {
      id: 'm5',
      conversationId: 'conv1',
      senderId: 'u2',
      message: 'Hey! Want to collaborate on the dashboard?',
      timestamp: '10:40 AM',
      reactions: [],
    },
  ],
  conv2: [
    {
      id: 'm6',
      conversationId: 'conv2',
      senderId: 'u6',
      message: "I've set up the CI/CD pipeline for the project.",
      timestamp: '9:00 AM',
      reactions: [],
    },
    {
      id: 'm7',
      conversationId: 'conv2',
      senderId: 'u1',
      message: 'Great work! Can you walk me through the stages?',
      timestamp: '9:15 AM',
      reactions: [{ emoji: '🚀', userId: 'u6' }],
    },
    {
      id: 'm8',
      conversationId: 'conv2',
      senderId: 'u6',
      message: 'The deploy pipeline is ready for review.',
      timestamp: '9:30 AM',
      reactions: [],
    },
  ],
  conv3: [
    {
      id: 'm9',
      conversationId: 'conv3',
      senderId: 'u4',
      message: 'Started the Flutter integration for the mobile app.',
      timestamp: '2:00 PM',
      reactions: [],
    },
    {
      id: 'm10',
      conversationId: 'conv3',
      senderId: 'u1',
      message: 'How is the performance looking?',
      timestamp: '2:10 PM',
      reactions: [],
    },
    {
      id: 'm11',
      conversationId: 'conv3',
      senderId: 'u4',
      message: 'The mobile build was successful! 🎉',
      timestamp: '2:30 PM',
      reactions: [{ emoji: '🎉', userId: 'u1' }],
    },
  ],
  conv4: [
    {
      id: 'm12',
      conversationId: 'conv4',
      senderId: 'u8',
      message: 'Check out the new component library.',
      timestamp: '11:00 AM',
      reactions: [],
    },
  ],
};

// ---- Notifications ----
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'connection',
    title: 'New Connection Request',
    message: 'Tom Wilson wants to connect with you',
    time: '2m ago',
    read: false,
    userId: 'u7',
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New Message',
    message: 'Sarah Chen sent you a message',
    time: '5m ago',
    read: false,
    userId: 'u2',
  },
  {
    id: 'n3',
    type: 'project',
    title: 'Project Update',
    message: 'CloudDeploy has a new milestone',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'connection',
    title: 'Connection Accepted',
    message: 'David Kim accepted your request',
    time: '2h ago',
    read: true,
    userId: 'u5',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Profile Boost',
    message: 'Your profile was viewed 12 times today',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'project',
    title: 'New Application',
    message: 'Marcus Johnson applied to DataPipeline Pro',
    time: '5h ago',
    read: true,
    userId: 'u3',
  },
];

// ---- Activity Events ----
export const mockActivities: ActivityEvent[] = [
  {
    id: 'a1',
    type: 'connection_accepted',
    title: 'Connection Accepted',
    message: 'Lisa Park accepted your connection request',
    time: '2 hours ago',
    userName: 'Lisa Park',
    status: 'completed',
  },
  {
    id: 'a2',
    type: 'project_created',
    title: 'Project Created',
    message: 'You created DevBoard — Developer Dashboard',
    time: '3 hours ago',
    userName: 'You',
    status: 'completed',
  },
  {
    id: 'a3',
    type: 'connection_sent',
    title: 'Request Sent',
    message: 'You sent a connection request to Marcus Johnson',
    time: '5 hours ago',
    userName: 'Marcus Johnson',
    status: 'pending',
  },
  {
    id: 'a4',
    type: 'message',
    title: 'New Message',
    message: 'David Kim sent you a message about CodeMentor AI',
    time: '6 hours ago',
    userName: 'David Kim',
    status: 'unread',
  },
  {
    id: 'a5',
    type: 'collaboration',
    title: 'Collaboration Invite',
    message: 'Lisa Park invited you to DesignKit project',
    time: '1 day ago',
    userName: 'Lisa Park',
    status: 'pending',
  },
  {
    id: 'a6',
    type: 'profile_view',
    title: 'Profile Viewed',
    message: 'Your profile was viewed 8 times this week',
    time: '1 day ago',
    userName: 'System',
    status: 'completed',
  },
  {
    id: 'a7',
    type: 'connection_accepted',
    title: 'Connection Accepted',
    message: 'Elena Rodriguez accepted your connection request',
    time: '2 days ago',
    userName: 'Elena Rodriguez',
    status: 'completed',
  },
];

// ---- Trending Skills ----
export const trendingSkills = [
  { name: 'React', change: '+12%', projects: 156 },
  { name: 'TypeScript', change: '+8%', projects: 142 },
  { name: 'Next.js', change: '+15%', projects: 98 },
  { name: 'Rust', change: '+22%', projects: 67 },
  { name: 'Go', change: '+10%', projects: 89 },
  { name: 'Python', change: '+5%', projects: 201 },
];
