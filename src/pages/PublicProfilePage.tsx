import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useUserById } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { useDiscussionPosts } from '@/hooks/useDiscussion';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Calendar, Briefcase, MessageSquare, Heart } from 'lucide-react';
import { AppGithubIcon, AppXTwitterIcon } from '@/components/Icons';
import type { Project } from '@/types/api';
import type { Post } from '@/services/discussion.service';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const { data: profile, isLoading: profileLoading } = useUserById(id || '', !!id);
  const sendRequest = useSendConnectionRequest();

  // Fetch all projects and filter by user
  const { data: projectsData, isLoading: projectsLoading } = useProjects({});
  const userProjects = (projectsData?.data || []).filter((p: Project) => p.owner?.id === id);

  // Fetch discussions by this user
  const { data: discussionsData, isLoading: discussionsLoading } = useDiscussionPosts({ authorId: id });
  const discussions = discussionsData?.pages?.flatMap((page) => page.data || []) || [];

  const isOwnProfile = currentUser?.id === id;

  const handleConnect = async () => {
    if (!id) return;
    try {
      await sendRequest.mutateAsync(id);
      toast.success('Connection request sent!');
    } catch {
      toast.error('Failed to send connection request');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card-modern p-12 text-center">
        <div className="text-4xl mb-4">◉</div>
        <p className="text-foreground font-medium mb-2">User not found</p>
        <button onClick={() => navigate(-1)} className="text-sm text-primary hover:text-primary/80 transition-colors">
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Profile Hero */}
      <div className="card-modern overflow-hidden">
        <div className="h-48 gradient-primary relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 mix-blend-overlay" />
          <div className="absolute inset-0 opacity-20 grid-pattern" />
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="relative group">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.firstName} className="h-32 w-32 rounded-2xl object-cover border-4 border-card shadow-card bg-card ring-2 ring-primary/20" />
              ) : (
                <div className="h-32 w-32 rounded-2xl border-4 border-card shadow-card gradient-primary flex items-center justify-center text-4xl font-bold text-white">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
              )}
              {profile.isOnline && (
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-card" />
              )}
            </div>
            <div className="flex gap-3 mb-2">
              {!isOwnProfile && (
                <>
                  <button onClick={() => navigate(`/chat`)} className="btn-secondary px-6">Message</button>
                  <button
                    onClick={handleConnect}
                    disabled={sendRequest.isPending}
                    className="btn-primary px-8"
                  >
                    {sendRequest.isPending ? 'Sending…' : 'Connect'}
                  </button>
                </>
              )}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-primary"
                >
                  Edit My Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {profile.firstName} {profile.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {profile.email}</span>
                {profile.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.location}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {profile.github && (
                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                  <AppGithubIcon className="h-5 w-5" />
                </a>
              )}
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-blue-400 transition-all">
                  <AppXTwitterIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card-modern p-6">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">About</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {profile.bio || `Independent developer sharing knowledge and building projects on Dev-Collab.`}
            </p>
          </div>

          <div className="card-modern p-6">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Skills</h3>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="tag-primary px-3 py-1">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
            )}
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Active Projects
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsLoading ? (
                [1, 2].map(i => <div key={i} className="h-32 card-modern animate-pulse bg-muted/20" />)
              ) : userProjects.length === 0 ? (
                <div className="col-span-2 card-modern p-8 text-center border-dashed">
                  <p className="text-sm text-muted-foreground">This user hasn't launched any projects yet.</p>
                </div>
              ) : (
                userProjects.slice(0, 4).map(project => (
                  <div key={project.id} className="card-modern p-5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                    <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 2).map((tech: string) => (
                        <span key={tech} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Discussions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" /> Recent Discussions
              </h3>
            </div>
            <div className="space-y-4">
              {discussionsLoading ? (
                [1, 2].map(i => <div key={i} className="h-24 card-modern animate-pulse bg-muted/20" />)
              ) : !discussions || discussions.length === 0 ? (
                <div className="card-modern p-8 text-center border-dashed">
                  <p className="text-sm text-muted-foreground">No public discussions started yet.</p>
                </div>
              ) : (
                discussions.slice(0, 3).map((post: Post) => (
                  <Link key={post.id} to={`/discussion/${post.id}`} className="block card-modern p-5 hover:border-accent/30 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{post.category}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-foreground group-hover:text-accent transition-colors mb-2">{post.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likesCount}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentsCount}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
