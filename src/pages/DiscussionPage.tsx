import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

import { PageTransition } from '@/components/PageTransition';
import { ComposeBox } from '@/components/discussion/ComposeBox';
import { PostCard } from '@/components/discussion/PostCard';
import { DiscussionSidebar } from '@/components/discussion/DiscussionSidebar';
import { initialPosts as seedPosts } from '@/components/discussion/initialPosts';
import { type Post, type PostCategory } from '@/components/discussion/types';
import { CATEGORIES } from '@/components/discussion/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function DiscussionPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [showBookmarks, setShowBookmarks] = useState(false);

  const currentUserId = user ? `${user.firstName}-${user.lastName}` : 'anon';

  const handleCreatePost = (content: string, category: PostCategory) => {
    const post: Post = {
      id: `p${Date.now()}`,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
      authorInitials: user ? `${user.firstName[0]}${user.lastName[0]}` : 'AN',
      authorBio: user?.bio || 'Developer',
      content,
      tags: [],
      category,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      bookmarked: false,
      reactions: [],
      formatting: 'rich',
    };
    setPosts((prev) => [post, ...prev]);
    toast.success('Post created!');
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)),
    );
    const post = posts.find((p) => p.id === id);
    toast.success(
      post?.bookmarked ? 'Post removed from bookmarks' : 'Post bookmarked!',
    );
  };

  const handleShare = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p)),
    );
    toast.success('Post link copied to clipboard!');
  };

  const handleComment = (
    postId: string,
    text: string,
    parentCommentId?: string,
  ) => {
    const newComment = {
      id: `c${Date.now()}`,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
      authorInitials: user ? `${user.firstName[0]}${user.lastName[0]}` : 'AN',
      content: text,
      timestamp: 'Just now',
    };

    const addReplyToComments = (
      comments: import('@/components/discussion/types').Comment[],
    ): import('@/components/discussion/types').Comment[] =>
      comments.map((c) =>
        c.id === parentCommentId
          ? { ...c, replies: [...(c.replies || []), newComment] }
          : {
              ...c,
              replies: c.replies ? addReplyToComments(c.replies) : undefined,
            },
      );

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return parentCommentId
          ? { ...p, comments: addReplyToComments(p.comments) }
          : { ...p, comments: [...p.comments, newComment] };
      }),
    );
  };

  const handleReact = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const existing = p.reactions.find(
          (r) => r.emoji === emoji && r.userId === currentUserId,
        );
        return {
          ...p,
          reactions: existing
            ? p.reactions.filter(
                (r) => !(r.emoji === emoji && r.userId === currentUserId),
              )
            : [...p.reactions, { emoji, userId: currentUserId }],
        };
      }),
    );
  };

  const bookmarkCount = posts.filter((p) => p.bookmarked).length;

  const filteredPosts = useMemo(() => {
    if (showBookmarks) return posts.filter((p) => p.bookmarked);
    if (selectedCategory === 'all') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory, showBookmarks]);

  return (
    <PageTransition>
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid lg:grid-cols-[1fr_320px] gap-8 max-w-5xl mx-auto'>
            {/* Main Feed */}
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-heading font-bold'>Discussion</h1>
                {/* Mobile category pills */}
                <div className='flex lg:hidden gap-1.5 overflow-x-auto'>
                  {CATEGORIES.slice(0, 4).map((c) => (
                    <Badge
                      key={c.value}
                      variant={
                        selectedCategory === c.value ? 'default' : 'secondary'
                      }
                      className='cursor-pointer whitespace-nowrap text-xs'
                      onClick={() => {
                        setShowBookmarks(false);
                        setSelectedCategory(c.value);
                      }}
                    >
                      {c.emoji} {c.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {user ? (
                <ComposeBox onPost={handleCreatePost} />
              ) : (
                <Card className='glass border-border/50 shadow-card p-5 text-center text-muted-foreground text-sm'>
                  <a
                    href='/signin'
                    className='text-primary hover:underline font-medium'
                  >
                    Sign in
                  </a>{' '}
                  to join the discussion
                </Card>
              )}

              {/* Posts */}
              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <div className='text-center py-12 text-muted-foreground'>
                    <p className='text-sm'>
                      {showBookmarks
                        ? 'No saved posts yet.'
                        : 'No posts in this category yet.'}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={i}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onShare={handleShare}
                      onComment={handleComment}
                      onReact={handleReact}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <DiscussionSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={(c) => {
                setShowBookmarks(false);
                setSelectedCategory(c);
              }}
              bookmarkCount={bookmarkCount}
              showBookmarks={showBookmarks}
              onToggleBookmarks={() => setShowBookmarks(!showBookmarks)}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
