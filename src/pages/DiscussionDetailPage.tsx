import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDiscussionPost, useComments, useCreateComment, useToggleLike, useToggleBookmark } from '@/hooks/useDiscussion';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { MessageSquare, Heart, Bookmark, Share2, ArrowLeft, Send, CornerDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const renderMarkdown = (text: string) => {
  let html = text.replace(/<[^>]*>?/gm, ''); // sanitize basic HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bold
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // italic
  html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>'); // inline code
  html = html.replace(/\n\n/g, '<br/><br/>'); // paragraphs
  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose-modern" />;
};
export default function DiscussionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: post, isLoading: postLoading } = useDiscussionPost(id || '', !!id);
  const { data: comments, isLoading: commentsLoading } = useComments(id || '', !!id);
  
  const createCommentMutation = useCreateComment();
  const toggleLikeMutation = useToggleLike();
  const toggleBookmarkMutation = useToggleBookmark();

  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please sign in to comment');
    if (!commentText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId: id!,
        data: { content: commentText.trim(), parentComment: replyTo ?? undefined }
      });
      setCommentText('');
      setReplyTo(null);
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment.');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please sign in to like');
    try {
      await toggleLikeMutation.mutateAsync(id!);
    } catch {
      toast.error('Failed to like post.');
    }
  };

  if (postLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="card-modern p-12 text-center">
        <p className="text-muted-foreground mb-4">Post not found.</p>
        <Button onClick={() => navigate('/discussion')}>Back to Forum</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="ghost"
        onClick={() => navigate('/discussion')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Forum
      </Button>

      {/* Main Post Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-modern p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-glow">
            {post.author.firstName[0]}{post.author.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {post.author.firstName} {post.author.lastName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {post.author.headline || 'Developer'} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="ml-auto tag-primary shrink-0">{post.category}</span>
        </div>

        <h1 className="text-3xl font-heading font-bold text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="prose-modern mb-8 text-foreground/90">
          {renderMarkdown(post.content)}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm ${post.isLiked ? 'text-accent' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-accent' : ''}`} />
              <span className="font-medium">{post.likesCount || 0}</span>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{post.commentsCount || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmarkMutation.mutate(post.id)}
              className={`${post.isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-primary' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Comment Section Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="section-title">Comments ({post.commentsCount})</h2>
      </div>

      {/* Compose Comment */}
      {isAuthenticated ? (
        <div className="card-modern p-6">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            {replyTo && (
              <div className="flex items-center justify-between text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-md border border-primary/10">
                <span className="flex items-center gap-1.5">
                  <CornerDownRight className="h-3 w-3" /> Replying to a comment
                </span>
                <Button variant="link" size="sm" onClick={() => setReplyTo(null)} className="font-bold">Cancel</Button>
              </div>
            )}
            <textarea
              placeholder="Add to the discussion..."
              className="input-modern min-h-[100px] resize-none w-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Be respectful and helpful.</p>
              <Button 
                type="submit" 
                disabled={createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? 'Posting...' : (
                  <>
                    <span>Post Comment</span>
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card-modern p-8 text-center border-dashed">
          <p className="text-muted-foreground text-sm mb-4">Check back later or sign in to join the conversation.</p>
          <Button asChild variant="secondary">
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {commentsLoading ? (
          <div className="flex justify-center p-8">
            <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : comments?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Start the conversation!</p>
        ) : (
          comments?.filter(c => !c.parentComment).map((comment) => (
            <div key={comment.id} className="card-modern p-5">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0">
                  {comment.author.firstName[0]}{comment.author.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent">
                      <Heart className="h-3.5 w-3.5" />
                      {comment.likesCount}
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyTo(comment.id);
                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                          const top = textarea.offsetTop - 100;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                      className="text-xs text-muted-foreground hover:text-primary font-medium"
                    >
                      Reply
                    </Button>
                  </div>

                  {/* Nested Replies (Simplified) */}
                  {comments?.filter(r => r.parentComment === comment.id).map(reply => (
                    <div key={reply.id} className="mt-4 pt-4 border-t border-border/10 flex items-start gap-3">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px] shrink-0">
                        {reply.author.firstName[0]}{reply.author.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">{reply.author.firstName}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-foreground/90 mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
