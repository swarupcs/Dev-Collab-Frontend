import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Bookmark,
  Reply,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { EmojiReaction } from '@/components/EmojiReaction';
import { type Post, type Comment, CATEGORIES } from './types';
import { useState, useMemo } from 'react';

interface PostCardProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onComment: (id: string, text: string, parentCommentId?: string) => void;
  onReact: (id: string, emoji: string) => void;
}

function renderRichText(text: string) {
  // Simple markdown-like rendering: **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <strong key={i} className='font-semibold'>
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code
          key={i}
          className='bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary'
        >
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

export function PostCard({
  post,
  index,
  onLike,
  onBookmark,
  onShare,
  onComment,
  onReact,
}: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(
    new Set(),
  );
  const currentUserId = user ? `${user.firstName}-${user.lastName}` : 'anon';
  const categoryInfo = CATEGORIES.find((c) => c.value === post.category);

  const toggleThread = (commentId: string) => {
    setCollapsedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    onComment(post.id, replyText, parentId);
    setReplyText('');
    setReplyingTo(null);
  };

  const countAllComments = (comments: Comment[]): number =>
    comments.reduce(
      (sum, c) => sum + 1 + (c.replies ? countAllComments(c.replies) : 0),
      0,
    );

  const totalComments = countAllComments(post.comments);

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div
      key={comment.id}
      className={depth > 0 ? 'ml-6 border-l-2 border-border/30 pl-3' : ''}
    >
      <div className='flex gap-2.5'>
        <Avatar className='h-7 w-7 shrink-0'>
          <AvatarFallback className='bg-muted text-muted-foreground text-xs font-heading'>
            {comment.authorInitials}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <div className='bg-muted/50 rounded-xl px-3 py-2'>
            <p className='text-xs font-heading font-semibold'>
              {comment.authorName}
              <span className='text-muted-foreground font-normal ml-2'>
                {comment.timestamp}
              </span>
            </p>
            <p className='text-sm mt-0.5'>{comment.content}</p>
          </div>
          {user && (
            <button
              className='text-xs text-muted-foreground hover:text-primary mt-1 ml-2 flex items-center gap-1'
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setReplyText('');
              }}
            >
              <Reply className='h-3 w-3' /> Reply
            </button>
          )}
          {replyingTo === comment.id && (
            <div className='flex gap-2 mt-2 ml-2'>
              <input
                className='flex-1 bg-muted/50 rounded-xl px-3 py-1.5 text-sm border-0 outline-none focus:ring-1 focus:ring-primary'
                placeholder={`Reply to ${comment.authorName}…`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitReply(comment.id)}
                autoFocus
              />
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8'
                onClick={() => submitReply(comment.id)}
              >
                <Send className='h-3.5 w-3.5' />
              </Button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className='mt-2'>
          {comment.replies.length >= 2 && (
            <button
              className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-2 ml-6'
              onClick={() => toggleThread(comment.id)}
            >
              {collapsedThreads.has(comment.id) ? (
                <>
                  <ChevronRight className='h-3 w-3' /> Show{' '}
                  {comment.replies.length} replies
                </>
              ) : (
                <>
                  <ChevronDown className='h-3 w-3' /> Hide replies
                </>
              )}
            </button>
          )}
          {!collapsedThreads.has(comment.id) && (
            <div className='space-y-2'>
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className='group glass border-border/50 shadow-card hover:shadow-card-hover transition-all'>
        <CardContent className='p-5'>
          {/* Author row */}
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 ring-2 ring-primary/10'>
                <AvatarFallback className='bg-primary/10 text-primary font-heading text-sm'>
                  {post.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='flex items-center gap-2'>
                  <p className='font-heading font-semibold text-sm'>
                    {post.authorName}
                  </p>
                  {categoryInfo && categoryInfo.value !== 'all' && (
                    <Badge
                      variant='outline'
                      className='text-[10px] px-1.5 py-0 h-4 border-border/50 text-muted-foreground'
                    >
                      {categoryInfo.emoji} {categoryInfo.label}
                    </Badge>
                  )}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {post.authorBio} · {post.timestamp}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className={`h-8 w-8 ${post.bookmarked ? 'text-accent' : 'text-muted-foreground'}`}
                onClick={() => onBookmark(post.id)}
                title={post.bookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark
                  className={`h-4 w-4 ${post.bookmarked ? 'fill-accent' : ''}`}
                />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground'
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Content with rich text */}
          <div className='text-sm leading-relaxed whitespace-pre-line mb-3'>
            {renderRichText(post.content)}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-3'>
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant='secondary'
                  className='text-xs font-normal'
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Emoji reactions */}
          <EmojiReaction
            reactions={post.reactions}
            onReact={(emoji) => onReact(post.id, emoji)}
            currentUserId={currentUserId}
          />

          {/* Action bar */}
          <div className='flex items-center gap-1 border-t border-border/50 pt-3 mt-3'>
            <Button
              variant='ghost'
              size='sm'
              className={`text-muted-foreground hover:text-primary ${post.liked ? 'text-primary' : ''}`}
              onClick={() => onLike(post.id)}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${post.liked ? 'fill-primary' : ''}`}
              />
              {post.likes}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-primary'
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className='h-4 w-4 mr-1' />
              {totalComments}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-primary'
              onClick={() => onShare(post.id)}
            >
              <Share2 className='h-4 w-4 mr-1' />
              {post.shares}
            </Button>
          </div>

          {/* Comments */}
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className='mt-4 space-y-3 border-t border-border/50 pt-4'
            >
              <div className='space-y-3'>
                {post.comments.map((comment) => renderComment(comment))}
              </div>
              <div className='flex gap-2.5'>
                <Avatar className='h-7 w-7 shrink-0'>
                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 flex gap-2'>
                  <input
                    className='flex-1 bg-muted/50 rounded-xl px-3 py-1.5 text-sm border-0 outline-none focus:ring-1 focus:ring-primary'
                    placeholder='Write a comment…'
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  />
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8'
                    onClick={submitComment}
                  >
                    <Send className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
