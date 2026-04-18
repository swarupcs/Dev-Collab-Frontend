import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiscussionPosts, useCreatePost, useToggleLike, useToggleBookmark } from '@/hooks/useDiscussion';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { MessageSquare, Heart, Bookmark, Share2, Plus, Search, SortAsc, Hash, Sparkles, Clock, MessagesSquare, ArrowRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SkeletonCard } from '@/components/SkeletonCard';

// Enhanced markdown parser
const renderMarkdown = (text: string) => {
  let html = text.replace(/<[^>]*>?/gm, ''); // sanitize basic HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>'); // bold
  html = html.replace(/\*(.*?)\*/g, '<em class="text-muted-foreground italic">$1</em>'); // italic
  html = html.replace(/`(.*?)`/g, '<code class="bg-muted/50 px-1.5 py-0.5 rounded-md text-sm font-mono text-foreground border border-border/50">$1</code>'); // inline code
  html = html.replace(/\n\n/g, '<br/><br/>'); // paragraphs
  return <div dangerouslySetInnerHTML={{ __html: html }} className="prose-modern text-[15px] leading-relaxed" />;
};

const CATEGORIES = ['All', 'Tech', 'Design', 'Career', 'Open Source', 'DevOps', 'AI/ML', 'Announcements'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DiscussionPage() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Tech' });

  const { data: posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDiscussionPosts({
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
        toast.success('Post published successfully!');
      }
    });
  };

  const allPosts = posts?.pages.flatMap(page => page.data) || [];

  return (
    <div className="container mx-auto max-w-[1200px] py-8 px-4 sm:px-6 min-h-screen">
      {/* Enhanced Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 p-8 sm:p-10 mb-10 shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <MessagesSquare className="w-64 h-64 text-primary transform rotate-12 translate-x-8 -translate-y-12" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              Community Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Developer Discussions
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
              Connect with peers, share your knowledge, ask questions, and collaborate on building the future of software.
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowCompose(true)} size="lg" className="gap-2 shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-full px-6">
              <Plus className="h-5 w-5" />
              Start Discussion
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                Categories
              </h3>
              <nav className="space-y-1 relative">
                {CATEGORIES.map(category => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeCategory" 
                          className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-between w-full">
                        {category}
                        {isActive && <ArrowRight className="h-3.5 w-3.5 opacity-70" />}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Helpful tip card */}
            <div className="mt-6 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                <Lightbulb className="h-4 w-4" />
                <h4 className="text-sm">Pro Tip</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use markdown to format your posts. You can add code blocks, bold text, and lists to make your discussions clearer!
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Enhanced Toolbar */}
          <div className="bg-card border border-border/50 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 mb-8 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search discussions by keyword..." 
                className="pl-10 h-11 bg-transparent border-none shadow-none text-sm focus-visible:ring-0 px-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[1px] h-[1px] sm:h-8 bg-border/50 self-center hidden sm:block" />
            <div className="flex items-center px-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-full sm:w-[160px] h-11 bg-transparent border-none shadow-none text-sm focus:ring-0 font-medium">
                  <div className="flex items-center text-muted-foreground">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <span>Sort by:</span>
                  </div>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl shadow-lg border-border/50">
                  <SelectItem value="recent" className="rounded-lg cursor-pointer">Most Recent</SelectItem>
                  <SelectItem value="top" className="rounded-lg cursor-pointer">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posts List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            {isLoading && allPosts.length === 0 ? (
              <div className="space-y-5">
                <SkeletonCard lines={3} />
                <SkeletonCard lines={2} />
                <SkeletonCard lines={3} />
              </div>
            ) : allPosts.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center p-16 border border-dashed border-border/60 rounded-3xl bg-muted/5 flex flex-col items-center justify-center">
                <div className="bg-background p-4 rounded-full shadow-sm border border-border/50 mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No discussions found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">We couldn't find any posts matching your current filters. Be the first to start a conversation in this topic!</p>
                {isAuthenticated && (
                  <Button onClick={() => setShowCompose(true)} className="rounded-full px-6">
                    Start a discussion
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {allPosts.map((post: any) => (
                  <motion.div 
                    variants={itemVariants}
                    layout
                    key={post.id} 
                    className="group bg-card border border-border/40 rounded-3xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden"
                  >
                    {/* Subtle top gradient accent on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:via-primary/40 group-hover:to-primary/20 transition-all duration-500" />
                    
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <Link to={`/profile/${post.author.id}`} className="shrink-0 hidden sm:block">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                          <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-bold">
                            {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      
                      <div className="flex-1 min-w-0 w-full">
                        {/* Post Meta */}
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="flex items-center flex-wrap gap-2 text-sm">
                            <Link to={`/profile/${post.author.id}`} className="sm:hidden shrink-0 mr-1">
                              <Avatar className="h-6 w-6 border border-border/50">
                                <AvatarImage src={post.author.avatarUrl} />
                                <AvatarFallback className="text-[10px]">{post.author.firstName?.[0]}</AvatarFallback>
                              </Avatar>
                            </Link>
                            <Link to={`/profile/${post.author.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                              {post.author.firstName} {post.author.lastName}
                            </Link>
                            <span className="text-muted-foreground text-xs font-medium bg-muted px-2 py-0.5 rounded-md">@{post.author.username}</span>
                            <span className="text-muted-foreground text-xs">•</span>
                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        {/* Post Content */}
                        <Link to={`/discussion/${post.id}`} className="block mt-1 mb-3">
                          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <div className="text-muted-foreground line-clamp-3 mb-5">
                          {renderMarkdown(post.content)}
                        </div>

                        {/* Action Bar & Tags */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border/40">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-medium text-xs bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors px-3 py-1 rounded-full">
                              {post.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:gap-1 w-full sm:w-auto">
                            <button 
                              onClick={() => toggleLikeMutation.mutate(post.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold transition-all px-3 py-1.5 rounded-full ${post.isLiked ? 'text-rose-500 bg-rose-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                              <Heart className={`h-4 w-4 transition-transform ${post.isLiked ? 'fill-rose-500 scale-110' : 'group-hover:scale-110'}`} />
                              <span>{post.likesCount || 0}</span>
                            </button>
                            <Link 
                              to={`/discussion/${post.id}`}
                              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all px-3 py-1.5 rounded-full"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.commentsCount || 0}</span>
                            </Link>
                            <button 
                              onClick={() => toggleBookmarkMutation.mutate(post.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold transition-all px-3 py-1.5 rounded-full ${post.isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                              <Bookmark className={`h-4 w-4 transition-transform ${post.isBookmarked ? 'fill-primary scale-110' : ''}`} />
                              <span className="hidden sm:inline">{post.bookmarksCount || 0}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground ml-auto sm:ml-0 transition-all px-3 py-1.5 rounded-full">
                              <Share2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {hasNextPage && (
              <div className="flex justify-center pt-8 pb-4">
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="rounded-full px-8 shadow-sm">
                  {isFetchingNextPage ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      Loading...
                    </span>
                  ) : 'Load older discussions'}
                </Button>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Enhanced Compose Dialog */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-background border-border/50 shadow-2xl rounded-3xl">
          <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Start a New Discussion
            </DialogTitle>
            <DialogDescription className="text-sm mt-2 text-muted-foreground">
              Share your thoughts, ask questions, or announce something exciting to the community.
            </DialogDescription>
          </div>
          <form onSubmit={handleCreatePost} className="p-8 space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Discussion Title</label>
                <Input
                  type="text"
                  placeholder="e.g., How do you manage state in large React apps?"
                  className="h-12 text-base bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl px-4 transition-all"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2 w-full sm:w-1/2">
                <label className="text-sm font-semibold text-foreground">Category</label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="h-12 text-base bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl px-4 transition-all">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-lg">
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <SelectItem key={c} value={c} className="rounded-lg cursor-pointer my-0.5">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Content</label>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Markdown supported
                  </span>
                </div>
                <Textarea
                  placeholder="Write your post here... Use **bold**, *italics*, or `code` to format."
                  className="min-h-[220px] resize-y text-base bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl p-4 transition-all"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={() => setShowCompose(false)} className="rounded-full px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={createPostMutation.isPending} className="rounded-full px-8 shadow-md hover:shadow-lg transition-all gap-2">
                {createPostMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish Post
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
