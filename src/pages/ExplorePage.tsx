import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useSearchUsers, useTrendingSkills } from '@/hooks/useUser';
import { useProjects, useApplyToProject } from '@/hooks/useProjects';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Briefcase, Globe, Send, Compass, Sparkles, Code2, MapPin, UserPlus, ArrowRight, Activity
} from 'lucide-react';
import type { Project } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/SkeletonCard';

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

export default function ExplorePage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [devPage, setDevPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'developers' | 'projects'>('all');

  // Modal State
  const [applyingTo, setApplyingTo] = useState<Project | null>(null);
  const [appData, setAppData] = useState({ role: '', message: '' });

  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(
    {
      query: searchQuery || undefined,
      skills: selectedSkill || undefined,
      page: devPage,
    },
    true
  );

  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    search: searchQuery || undefined,
    page: projectPage,
  });
  const { data: trendingSkills } = useTrendingSkills();

  const sendRequest = useSendConnectionRequest();
  const applyToProject = useApplyToProject();

  const developers = (searchResults?.data || []).filter(
    (d) => d.id !== user?.id
  );
  const projects = projectsData?.data || [];
  const isLoading = searchLoading || projectsLoading;

  const handleConnect = async (userId: string) => {
    try {
      await sendRequest.mutateAsync(userId);
      toast.success('Connection request sent!');
    } catch {
      toast.error('Failed to send connection request');
    }
  };

  const handleApply = (project: Project) => {
    setApplyingTo(project);
    setAppData({
      role: project.openRoles[0] || 'Contributor',
      message: `Hi! I'm interested in joining ${project.title}. I have experience with ${project.techStack.join(', ')}.`,
    });
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingTo) return;
    try {
      await applyToProject.mutateAsync({
        projectId: applyingTo.id,
        data: appData,
      });
      toast.success('Application submitted!');
      setApplyingTo(null);
    } catch {
      toast.error('Failed to apply to project');
    }
  };

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(selectedSkill === skill ? '' : skill);
    setSearchQuery('');
    setDevPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDevPage(1);
    setProjectPage(1);
    setSelectedSkill('');
  };

  return (
    <div className="container mx-auto max-w-[1200px] py-8 px-4 sm:px-6 min-h-screen">
      {/* Enhanced Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background border border-border/50 p-8 sm:p-10 mb-10 shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Compass className="w-64 h-64 text-foreground transform rotate-12 translate-x-8 -translate-y-12" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Discover
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Explore the Community
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
            Find brilliant developers, discover trending open-source projects, and build your professional network.
          </p>
        </div>
      </div>

      {/* Global Search & Filters Toolbar */}
      <div className="mb-10 space-y-6">
        <form onSubmit={handleSearch} className="relative max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Search developers, projects, or skills..."
            className="pl-12 h-14 bg-card border-border/60 text-base rounded-2xl shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="absolute inset-y-1.5 right-1.5 rounded-xl px-6">
            Search
          </Button>
        </form>

        {/* Trending Skills */}
        {!searchQuery && trendingSkills && trendingSkills.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Trending Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {trendingSkills.map((skill) => {
                const isActive = selectedSkill === skill.skill;
                return (
                  <button
                    key={skill.skill}
                    onClick={() => handleSkillClick(skill.skill)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                      isActive 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-105' 
                        : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {skill.skill}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'} font-semibold`}>
                      {skill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-card border border-border/50 p-1.5 rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {(['all', 'developers', 'projects'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="exploreTabs" 
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {tab}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                  {tab === 'all' && (developers.length + projects.length)}
                  {tab === 'developers' && developers.length}
                  {tab === 'projects' && projects.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Feed Content */}
      <div className="space-y-12 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} lines={4} />
            ))}
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
            
            {/* Developers Section */}
            {(activeTab === 'all' || activeTab === 'developers') && developers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" /> Developers
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {developers.map((dev) => (
                    <motion.div 
                      variants={itemVariants}
                      key={dev.id} 
                      className="group bg-card border border-border/50 rounded-3xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                          <AvatarImage src={dev.avatarUrl || ''} alt={dev.firstName} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-bold text-lg">
                            {dev.firstName[0]}{dev.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <Link to={`/profile/${dev.id}`} className="font-bold text-foreground text-lg hover:text-primary transition-colors truncate block">
                            {dev.firstName} {dev.lastName}
                          </Link>
                          {dev.location && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{dev.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {dev.bio ? (
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">
                          {dev.bio}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      
                      <div className="mt-auto space-y-5">
                        <div className="flex flex-wrap gap-1.5">
                          {dev.skills.slice(0, 3).map((s) => (
                            <Badge key={s} variant="secondary" className="font-medium text-[11px] bg-muted/50 border border-border/50 hover:bg-muted px-2.5 py-0.5 rounded-lg">
                              {s}
                            </Badge>
                          ))}
                          {dev.skills.length > 3 && (
                            <Badge variant="outline" className="font-medium text-[11px] border-border/50 text-muted-foreground px-2.5 py-0.5 rounded-lg">
                              +{dev.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                          <Button onClick={() => handleConnect(dev.id)} className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-all h-10 gap-2 font-semibold">
                            <UserPlus className="h-4 w-4" /> Connect
                          </Button>
                          <Button asChild variant="secondary" className="flex-1 rounded-xl h-10 font-semibold bg-muted hover:bg-muted/80">
                            <Link to={`/profile/${dev.id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {searchResults?.pagination && searchResults.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button onClick={() => setDevPage((p) => Math.max(1, p - 1))} disabled={devPage === 1} variant="outline" className="rounded-full px-6">
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      Page {devPage} of {searchResults.pagination.totalPages}
                    </span>
                    <Button onClick={() => setDevPage((p) => p + 1)} disabled={devPage === searchResults.pagination.totalPages} variant="outline" className="rounded-full px-6">
                      Next
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Projects Section */}
            {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-accent" /> Active Projects
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div 
                      variants={itemVariants}
                      key={project.id} 
                      className="group bg-card border border-border/50 rounded-3xl p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 flex flex-col h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="bg-accent/10 p-3 rounded-2xl text-accent border border-accent/20">
                          <Code2 className="h-6 w-6" />
                        </div>
                        <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'} className={`font-semibold rounded-full ${project.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20' : ''}`}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <Link to={`/projects/${project.id}`} className="block mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">
                        {project.description}
                      </p>
                      
                      <div className="mt-auto space-y-5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="font-medium text-[11px] bg-accent/5 text-accent border border-accent/10 px-2.5 py-0.5 rounded-lg">
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 3 && (
                            <Badge variant="outline" className="font-medium text-[11px] border-border/50 text-muted-foreground px-2.5 py-0.5 rounded-lg">
                              +{project.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                          <div className="flex items-center -space-x-2">
                            {project.members.slice(0, 3).map((m, i) => (
                              <Avatar key={i} className="h-8 w-8 border-2 border-card ring-1 ring-border/50">
                                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                  M{i+1}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.members.length > 3 && (
                              <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-1 ring-border/50 z-10">
                                +{project.members.length - 3}
                              </div>
                            )}
                          </div>
                          
                          {project.openRoles.length > 0 && (
                            <Button onClick={() => handleApply(project)} size="sm" className="rounded-xl font-semibold shadow-sm gap-1.5 h-9 bg-accent hover:bg-accent/90 text-white">
                              Apply Now <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button onClick={() => setProjectPage((p) => Math.max(1, p - 1))} disabled={projectPage === 1} variant="outline" className="rounded-full px-6">
                      Previous
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      Page {projectPage} of {projectsData.pagination.totalPages}
                    </span>
                    <Button onClick={() => setProjectPage((p) => p + 1)} disabled={projectPage === projectsData.pagination.totalPages} variant="outline" className="rounded-full px-6">
                      Next
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Empty State */}
            {developers.length === 0 && projects.length === 0 && (
              <motion.div variants={itemVariants} className="text-center p-16 border border-dashed border-border/60 rounded-3xl bg-muted/5 flex flex-col items-center justify-center w-full mt-8">
                <div className="bg-background p-4 rounded-full shadow-sm border border-border/50 mb-4">
                  <Globe className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Results Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  We couldn't find anything matching your search criteria. Try adjusting your search terms or clearing your skill filters.
                </p>
                <Button onClick={() => {setSearchQuery(''); setSelectedSkill('');}} variant="outline" className="rounded-full px-8">
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Application Modal */}
      <Dialog open={!!applyingTo} onOpenChange={(open) => !open && setApplyingTo(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background border-border/50 shadow-2xl rounded-3xl">
          <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-br from-accent/10 to-background relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Briefcase className="w-24 h-24 text-accent transform rotate-12" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Join Project
            </DialogTitle>
            <DialogDescription className="text-sm mt-2 text-muted-foreground">
              Applying for <span className="font-semibold text-foreground">{applyingTo?.title}</span>
            </DialogDescription>
          </div>
          
          <form onSubmit={submitApplication} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" /> Select Role
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-accent/20 rounded-xl px-4 appearance-none font-medium transition-all"
                  value={appData.role}
                  onChange={(e) => setAppData({ ...appData, role: e.target.value })}
                  required
                >
                  {applyingTo?.openRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="Contributor">Contributor</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground" /> Introduction Message
              </label>
              <textarea
                className="w-full min-h-[140px] resize-y bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-accent/20 rounded-xl p-4 text-sm transition-all"
                placeholder="Explain why you're a good fit for this project..."
                value={appData.message}
                onChange={(e) => setAppData({ ...appData, message: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="ghost" onClick={() => setApplyingTo(null)} className="rounded-full px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={applyToProject.isPending} className="rounded-full px-8 shadow-md hover:shadow-lg transition-all gap-2 bg-accent hover:bg-accent/90 text-white">
                {applyToProject.isPending ? 'Submitting...' : 'Send Application'}
                {!applyToProject.isPending && <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
