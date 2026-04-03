import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Users,
  FolderOpen,
  Sparkles,
  UserPlus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageTransition } from '@/components/PageTransition';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonCard, SkeletonList } from '@/components/SkeletonCard';
import { usersApi, projectsApi } from '@/services/mockApi';
import {
  trendingSkills,
  type MockUser,
  type Project,
} from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';
import { connectionsApi } from '@/services/mockApi';

export default function ExplorePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState<MockUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = async (q: string) => {
    setLoading(true);
    setHasSearched(true);
    const [devs, projs] = await Promise.all([
      usersApi.search(q),
      projectsApi.getAll(),
    ]);
    setDevelopers(devs.filter((d) => d.id !== user?.id));
    const lq = q.toLowerCase();
    setProjects(
      q
        ? projs.filter(
            (p) =>
              p.title.toLowerCase().includes(lq) ||
              p.description.toLowerCase().includes(lq) ||
              p.techStack.some((t) => t.toLowerCase().includes(lq)),
          )
        : projs,
    );
    setLoading(false);
  };

  // Load initial data on mount
  useEffect(() => {
    doSearch('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleSkillClick = (skill: string) => {
    setQuery(skill);
    doSearch(skill);
  };

  const handleConnect = async (targetId: string) => {
    try {
      await connectionsApi.send(user?.id || '', targetId);
      toast({ title: 'Connection request sent!' });
    } catch {
      toast({ title: 'Failed to send request', variant: 'destructive' });
    }
  };

  const handleApply = async (projectId: string) => {
    try {
      await projectsApi.apply(projectId, user?.id || '');
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, applicants: [...p.applicants, user?.id || ''] }
            : p,
        ),
      );
      toast({ title: 'Application submitted!' });
    } catch {
      toast({ title: 'Failed to apply', variant: 'destructive' });
    }
  };

  const matchedSkills = query
    ? trendingSkills.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const totalResults =
    developers.length + projects.length + matchedSkills.length;

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader title='Explore' />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-8'
          >
            <form
              onSubmit={handleSearch}
              className='relative max-w-2xl mx-auto'
            >
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search developers, projects, or skills...'
                className='pl-12 h-14 text-base rounded-2xl glass border-border/50 shadow-card focus-visible:shadow-card-hover'
              />
              <Button
                type='submit'
                size='sm'
                className='absolute right-2 top-1/2 -translate-y-1/2 gradient-primary border-0 shadow-glow font-medium rounded-xl'
              >
                Search
              </Button>
            </form>
          </motion.div>

          {/* Trending Skills (shown when no active search) */}
          {!query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className='mb-8'
            >
              <div className='flex items-center gap-2 mb-3'>
                <TrendingUp className='h-4 w-4 text-primary' />
                <h3 className='text-sm font-heading font-semibold text-muted-foreground'>
                  Trending Skills
                </h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {trendingSkills.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => handleSkillClick(skill.name)}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card/50 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors'
                  >
                    {skill.name}
                    <span className='text-xs text-primary font-heading'>
                      {skill.change}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {loading ? (
            <div className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='space-y-6'
            >
              <TabsList className='glass border border-border/50 p-1 h-auto'>
                <TabsTrigger
                  value='all'
                  className='data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
                >
                  All {hasSearched && `(${totalResults})`}
                </TabsTrigger>
                <TabsTrigger
                  value='developers'
                  className='flex items-center gap-1.5 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
                >
                  <Users className='h-3.5 w-3.5' />
                  Developers ({developers.length})
                </TabsTrigger>
                <TabsTrigger
                  value='projects'
                  className='flex items-center gap-1.5 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
                >
                  <FolderOpen className='h-3.5 w-3.5' />
                  Projects ({projects.length})
                </TabsTrigger>
                {matchedSkills.length > 0 && (
                  <TabsTrigger
                    value='skills'
                    className='flex items-center gap-1.5 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
                  >
                    <Sparkles className='h-3.5 w-3.5' />
                    Skills ({matchedSkills.length})
                  </TabsTrigger>
                )}
              </TabsList>

              {/* All Tab */}
              <TabsContent value='all' className='space-y-8'>
                {totalResults === 0 ? (
                  <EmptyState
                    icon={Search}
                    title='No results found'
                    description={`No matches for "${query}". Try different keywords.`}
                  />
                ) : (
                  <>
                    {/* Skills section */}
                    {matchedSkills.length > 0 && (
                      <div>
                        <h3 className='text-sm font-heading font-semibold text-muted-foreground mb-3 flex items-center gap-2'>
                          <Sparkles className='h-4 w-4' />
                          Skills
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {matchedSkills.map((s) => (
                            <div
                              key={s.name}
                              className='inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border/50'
                            >
                              <span className='font-medium text-sm'>
                                {s.name}
                              </span>
                              <Badge
                                variant='secondary'
                                className='font-heading text-xs'
                              >
                                {s.change}
                              </Badge>
                              <span className='text-xs text-muted-foreground'>
                                {s.projects} projects
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Developers section */}
                    {developers.length > 0 && (
                      <div>
                        <div className='flex items-center justify-between mb-3'>
                          <h3 className='text-sm font-heading font-semibold text-muted-foreground flex items-center gap-2'>
                            <Users className='h-4 w-4' />
                            Developers
                          </h3>
                          {developers.length > 4 && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setActiveTab('developers')}
                              className='text-xs'
                            >
                              View all <ArrowRight className='h-3 w-3 ml-1' />
                            </Button>
                          )}
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                          {developers.slice(0, 3).map((dev, i) => (
                            <DeveloperCard
                              key={dev.id}
                              dev={dev}
                              index={i}
                              onConnect={handleConnect}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects section */}
                    {projects.length > 0 && (
                      <div>
                        <div className='flex items-center justify-between mb-3'>
                          <h3 className='text-sm font-heading font-semibold text-muted-foreground flex items-center gap-2'>
                            <FolderOpen className='h-4 w-4' />
                            Projects
                          </h3>
                          {projects.length > 3 && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setActiveTab('projects')}
                              className='text-xs'
                            >
                              View all <ArrowRight className='h-3 w-3 ml-1' />
                            </Button>
                          )}
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                          {projects.slice(0, 3).map((p, i) => (
                            <ProjectCard
                              key={p.id}
                              project={p}
                              index={i}
                              currentUserId={user?.id}
                              onApply={handleApply}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Developers Tab */}
              <TabsContent value='developers'>
                {developers.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title='No developers found'
                    description='Try different search terms.'
                  />
                ) : (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {developers.map((dev, i) => (
                      <DeveloperCard
                        key={dev.id}
                        dev={dev}
                        index={i}
                        onConnect={handleConnect}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value='projects'>
                {projects.length === 0 ? (
                  <EmptyState
                    icon={FolderOpen}
                    title='No projects found'
                    description='Try different search terms.'
                  />
                ) : (
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {projects.map((p, i) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        index={i}
                        currentUserId={user?.id}
                        onApply={handleApply}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Skills Tab */}
              {matchedSkills.length > 0 && (
                <TabsContent value='skills'>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {matchedSkills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Card className='glass border-border/50 shadow-card hover:shadow-card-hover transition-all'>
                          <CardContent className='p-5'>
                            <div className='flex items-center justify-between mb-3'>
                              <h3 className='font-heading font-semibold text-lg'>
                                {skill.name}
                              </h3>
                              <Badge className='gradient-primary text-primary-foreground border-0 font-heading'>
                                {skill.change}
                              </Badge>
                            </div>
                            <p className='text-sm text-muted-foreground mb-4'>
                              {skill.projects} projects using this skill
                            </p>
                            <Button
                              variant='outline'
                              size='sm'
                              className='w-full'
                              onClick={() => {
                                setQuery(skill.name);
                                setActiveTab('developers');
                                doSearch(skill.name);
                              }}
                            >
                              Find {skill.name} developers
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </PageTransition>
    </div>
  );
}

// ---- Inline Developer Card ----
function DeveloperCard({
  dev,
  index,
  onConnect,
}: {
  dev: MockUser;
  index: number;
  onConnect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className='glass border-border/50 shadow-card hover:shadow-card-hover transition-all h-full'>
        <CardContent className='p-5'>
          <div className='flex items-start gap-3 mb-3'>
            <div className='relative'>
              <Avatar className='h-12 w-12 ring-2 ring-primary/10'>
                <AvatarFallback className='bg-primary/10 text-primary font-heading'>
                  {dev.firstName[0]}
                  {dev.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {dev.isOnline && (
                <div className='absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <Link
                to={`/profile/${dev.id}`}
                className='font-heading font-semibold hover:text-primary transition-colors text-sm'
              >
                {dev.firstName} {dev.lastName}
              </Link>
              <p className='text-xs text-muted-foreground truncate'>
                {dev.location}
              </p>
            </div>
          </div>
          <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
            {dev.bio}
          </p>
          <div className='flex flex-wrap gap-1.5 mb-4'>
            {dev.skills.slice(0, 3).map((s) => (
              <Badge key={s} variant='secondary' className='text-xs'>
                {s}
              </Badge>
            ))}
            {dev.skills.length > 3 && (
              <Badge variant='outline' className='text-xs'>
                +{dev.skills.length - 3}
              </Badge>
            )}
          </div>
          <div className='flex gap-2'>
            <Button
              size='sm'
              className='gradient-primary border-0 flex-1 shadow-glow font-medium'
              onClick={() => onConnect(dev.id)}
            >
              <UserPlus className='h-4 w-4 mr-1' />
              Connect
            </Button>
            <Button size='sm' variant='outline' asChild>
              <Link to={`/profile/${dev.id}`}>View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
