import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiscussionPosts, useCreatePost, useToggleLike, useToggleBookmark } from '@/hooks/useDiscussion';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { MessageSquare, Heart, Bookmark, Share2, Filter, PenLine, Search, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic markdown parser
const renderMarkdown = (text: string) => {
  let html = text.replace(/<[^>]*>?/gm, ''); // sanitize basic HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bold
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // italic
  html = html.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>'); // inline code
  html = html.replace(/\n\n/g, '<br/><br/>'); // paragraphs
  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose-modern" />;
};

const CATEGORIES = ['All', 'Tech', 'Design', 'Career', 'Open Source', 'DevOps', 'AI/ML', 'Announcements'];

export default function DiscussionPage() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Tech' });

  const { data: posts, isLoading } = useDiscussionPosts({
    category: activeCategory !== 'All' ? activeCategory : undefined,
    search: searchQuery || undefined,
    sort: sortBy,
  });

  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useToggleLike();
  const toggleBookmarkMutation = useToggleBookmark();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please sign in to post');
    createPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowCompose(false);
        setNewPost({ title: '', content: '', category: 'Tech' });
        toast.success('Post created successfully!');
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="card-modern p-4 sticky top-24">
          <h2 className="flex items-center gap-2 font-semibold text-foreground mb-4">
            <Filter className="h-4 w-4" /> Topics
          </h2>
          <div className="space-y-1">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === category 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title mb-1">Discussions</h1>
            <p className="page-subtitle">Share knowledge and connect with developers.</p>
          </div>
          {isAuthenticated && (
            <button 
              onClick={() => setShowCompose(!showCompose)}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <PenLine className="h-4 w-4" />
              New Post
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              className="input-modern pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <select 
              className="input-modern py-2 text-sm w-[120px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="recent">Recent</option>
              <option value="top">Popular</option>
            </select>
          </div>
        </div>

        {/* Compose Box */}
        <AnimatePresence>
          {showCompose && isAuthenticated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="card-modern p-6 border-primary/20 bg-primary/5">
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post Title..."
                    className="input-modern font-semibold text-lg bg-background"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    required
                  />
                  <div className="flex gap-4">
                    <select
                      className="input-modern bg-background w-1/3"
                      value={newPost.category}
                      onChange={e => setNewPost({...newPost, category: e.target.value})}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="text-xs text-muted-foreground flex items-center">
                      Markdown supported: **bold**, *italic*, `code`
                    </div>
                  </div>
                  <textarea
                    placeholder="Write your post content here..."
                    className="input-modern bg-background min-h-[150px] resize-y"
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    required
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowCompose(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={createPostMutation.isPending} className="btn-primary">
                      {createPostMutation.isPending ? 'Posting...' : 'Publish Post'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center p-12 card-modern rounded-xl border-dashed">
              <p className="text-muted-foreground">No posts found with current filters.</p>
              {isAuthenticated && !searchQuery && (
                <button onClick={() => setShowCompose(true)} className="text-primary mt-2 font-medium hover:underline">
                  Be the first to post!
                </button>
              )}
            </div>
          ) : (
            posts?.map((post: any) => (
              <motion.div 
                layout
                key={post.id} 
                className="card-modern p-6 group hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0 h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow">
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">
                        {post.author.firstName} {post.author.lastName}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ml-auto tag-muted text-[10px]">{post.category}</span>
                    </div>
                    
                    <Link to={`/discussion/${post.id}`}>
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <div className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                      {renderMarkdown(post.content)}
                    </div>
                    
                    {/* Action Bar */}
                    <div className="flex items-center gap-6 mt-4">
                      <button 
                        onClick={() => toggleLikeMutation.mutate(post.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors hover:text-accent ${post.isLiked ? 'text-accent' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-accent' : ''}`} />
                        {post.likesCount || 0}
                      </button>
                      <Link to={`/discussion/${post.id}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        {post.commentsCount || 0}
                      </Link>
                      <button 
                        onClick={() => toggleBookmarkMutation.mutate(post.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors hover:text-primary ${post.isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-primary' : ''}`} />
                        {post.bookmarksCount || 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
