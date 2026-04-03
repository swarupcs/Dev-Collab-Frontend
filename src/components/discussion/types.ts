export interface Post {
  id: string;
  authorName: string;
  authorInitials: string;
  authorBio: string;
  content: string;
  tags: string[];
  category: PostCategory;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  shares: number;
  bookmarked: boolean;
  reactions: { emoji: string; userId: string }[];
  formatting: 'plain' | 'rich';
}

export interface Comment {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export type PostCategory =
  | 'all'
  | 'tech'
  | 'design'
  | 'career'
  | 'opensource'
  | 'devops'
  | 'ai'
  | 'announcement';

export const CATEGORIES: {
  value: PostCategory;
  label: string;
  emoji: string;
}[] = [
  { value: 'all', label: 'All Posts', emoji: '📋' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'career', label: 'Career', emoji: '🚀' },
  { value: 'opensource', label: 'Open Source', emoji: '🌐' },
  { value: 'devops', label: 'DevOps', emoji: '⚙️' },
  { value: 'ai', label: 'AI / ML', emoji: '🤖' },
  { value: 'announcement', label: 'Announcements', emoji: '📢' },
];
