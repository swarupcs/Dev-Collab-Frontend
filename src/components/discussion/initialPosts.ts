import { type Post } from './types';

export const initialPosts: Post[] = [
  {
    id: 'p1',
    authorName: 'Sarah Chen',
    authorInitials: 'SC',
    authorBio: 'Full-stack developer • React & Node.js',
    content:
      "Just shipped a new feature using React Server Components and I'm blown away by the performance gains. The initial load time dropped by **40%**! 🚀\n\nHas anyone else experimented with RSC in production? Would love to hear your experiences.",
    tags: ['React', 'Performance', 'WebDev'],
    category: 'tech',
    timestamp: '2h ago',
    likes: 24,
    liked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Alex Rivera',
        authorInitials: 'AR',
        content:
          "That's impressive! We saw similar results. The key was properly splitting client vs server components.",
        timestamp: '1h ago',
      },
    ],
    shares: 5,
    bookmarked: false,
    reactions: [
      { emoji: '🚀', userId: 'u2' },
      { emoji: '🔥', userId: 'u3' },
    ],
    formatting: 'rich',
  },
  {
    id: 'p2',
    authorName: 'Marcus Johnson',
    authorInitials: 'MJ',
    authorBio: 'DevOps Engineer • Kubernetes & AWS',
    content:
      "Hot take: Most startups don't need Kubernetes. A simple Docker Compose setup handles 90% of use cases.\n\nStop over-engineering your infrastructure. Ship features instead. 💡",
    tags: ['DevOps', 'Docker', 'Opinion'],
    category: 'devops',
    timestamp: '5h ago',
    likes: 89,
    liked: false,
    comments: [
      {
        id: 'c2',
        authorName: 'Priya Patel',
        authorInitials: 'PP',
        content:
          'Agree 100%. We switched from K8s to a simple ECS setup and our deployment times went from 15min to 2min.',
        timestamp: '4h ago',
        replies: [
          {
            id: 'c2r1',
            authorName: 'Tom Wei',
            authorInitials: 'TW',
            content:
              'What region are you running in? We had latency issues with ECS in eu-west.',
            timestamp: '3h ago',
          },
        ],
      },
      {
        id: 'c3',
        authorName: 'Tom Wei',
        authorInitials: 'TW',
        content:
          'Depends on the scale though. Once you hit multi-region, K8s starts making more sense.',
        timestamp: '3h ago',
      },
    ],
    shares: 18,
    bookmarked: false,
    reactions: [
      { emoji: '💯', userId: 'u1' },
      { emoji: '👏', userId: 'u4' },
    ],
    formatting: 'plain',
  },
  {
    id: 'p3',
    authorName: 'Priya Patel',
    authorInitials: 'PP',
    authorBio: 'AI/ML Engineer • Python & TensorFlow',
    content:
      '🧵 Thread: 5 things I wish I knew before building my first ML pipeline in production:\n\n1. Data quality > model complexity\n2. Always version your datasets\n3. Monitoring drift is non-negotiable\n4. Start with simple baselines\n5. Feature stores save lives\n\nWhat would you add to this list?',
    tags: ['AI', 'MachineLearning', 'Tips'],
    category: 'ai',
    timestamp: '8h ago',
    likes: 156,
    liked: false,
    comments: [],
    shares: 42,
    bookmarked: false,
    reactions: [
      { emoji: '🔥', userId: 'u1' },
      { emoji: '🔥', userId: 'u2' },
      { emoji: '❤️', userId: 'u5' },
    ],
    formatting: 'plain',
  },
  {
    id: 'p4',
    authorName: 'Dev-Collab Team',
    authorInitials: 'DC',
    authorBio: 'Official • Platform Updates',
    content:
      "🎉 Exciting update! We just launched **Project Collaboration v2** with real-time code reviews, role-based invitations, and team activity feeds.\n\nCheck out the Projects page to try it out. We'd love your feedback!",
    tags: ['Announcement', 'DevCollab', 'Update'],
    category: 'announcement',
    timestamp: '1d ago',
    likes: 203,
    liked: false,
    comments: [
      {
        id: 'c4',
        authorName: 'Sarah Chen',
        authorInitials: 'SC',
        content:
          'The invitation system is exactly what we needed. Great work! 🎉',
        timestamp: '20h ago',
      },
    ],
    shares: 31,
    bookmarked: false,
    reactions: [
      { emoji: '🎉', userId: 'u1' },
      { emoji: '🎉', userId: 'u3' },
      { emoji: '❤️', userId: 'u2' },
    ],
    formatting: 'rich',
  },
  {
    id: 'p5',
    authorName: 'Elena Garcia',
    authorInitials: 'EG',
    authorBio: 'UX Designer • Figma & Framer',
    content:
      "Design systems are not about consistency alone — they're about **velocity**.\n\nA good design system lets your team ship 3x faster while maintaining quality. Here's the framework I use:\n\n`Tokens → Components → Patterns → Templates`\n\nEach layer builds on the previous. Don't skip steps.",
    tags: ['Design', 'DesignSystems', 'UX'],
    category: 'design',
    timestamp: '12h ago',
    likes: 67,
    liked: false,
    comments: [],
    shares: 14,
    bookmarked: false,
    reactions: [{ emoji: '👏', userId: 'u2' }],
    formatting: 'rich',
  },
];
