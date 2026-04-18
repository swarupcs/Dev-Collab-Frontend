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
  Search,
  Users,
  Briefcase,
  Globe,
  X,
  Send,
  ChevronRight,
} from 'lucide-react';
import type { Project } from '@/types/api';
import { Button } from '@/components/ui/button';

export default function ExplorePage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [devPage, setDevPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'developers' | 'projects'>(
    'all'
  );

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
      message: `Hi! I'm interested in joining ${project.title}. I have experience with ${project.techStack.join(
        ', '
      )}.`,
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
    <div>
      {/* Header */}
      <div className='page-header'>
        <h1 className='page-title'>Explore</h1>
        <p className='page-subtitle'>
          Discover developers and projects across the community
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className='mb-6'>
        <div className='relative'>
          <span className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground'>
            <Search className="h-5 w-5" />
          </span>
          <input
            type='text'
            placeholder='Search developers, projects, or skills…'
            className='input-modern pl-10'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Trending Skills */}
      {!searchQuery && trendingSkills && trendingSkills.length > 0 && (
        <div className='mb-8'>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
            Trending Skills
          </h3>
          <div className='flex flex-wrap gap-2'>
            {trendingSkills.map((skill) => (
              <Button
                key={skill.skill}
                onClick={() => handleSkillClick(skill.skill)}
                variant={selectedSkill === skill.skill ? 'primary' : 'secondary'}
              >
                {skill.skill}
                <span
                  className={`ml-1.5 text-xs ${selectedSkill === skill.skill ? 'text-white/70' : 'text-primary'}`}
                >
                  {skill.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className='flex gap-1 mb-6 bg-card/40 rounded-lg p-1 border border-border/30 w-fit'>
        {(['all', 'developers', 'projects'] as const).map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? 'default' : 'ghost'}
          >
            {tab === 'all' && `All (${developers.length + projects.length})`}
            {tab === 'developers' && `Developers (${developers.length})`}
            {tab === 'projects' && `Projects (${projects.length})`}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='card-modern p-6 animate-pulse space-y-3'>
              <div className='flex gap-3'>
                <div className='h-12 w-12 rounded-full bg-muted' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-2/3 bg-muted rounded' />
                  <div className='h-3 w-1/3 bg-muted rounded' />
                </div>
              </div>
              <div className='h-3 w-full bg-muted rounded' />
              <div className='flex gap-2'>
                <div className='h-6 w-14 bg-muted rounded' />
                <div className='h-6 w-14 bg-muted rounded' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Developers Section */}
          {(activeTab === 'all' || activeTab === 'developers') &&
            developers.length > 0 && (
              <div className='mb-8'>
                <h2 className='section-title mb-4'>Developers</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {developers.map((dev) => (
                    <div key={dev.id} className='card-modern p-5'>
                      <div className='flex items-start gap-3 mb-3'>
                        {dev.avatarUrl ? (
                          <img
                            src={dev.avatarUrl}
                            alt=''
                            className='h-11 w-11 rounded-full object-cover ring-2 ring-primary/20'
                          />
                        ) : (
                          <div className='h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm'>
                            {dev.firstName[0]}
                            {dev.lastName[0]}
                          </div>
                        )}
                        <div className='min-w-0 flex-1'>
                          <Link
                            to={`/profile/${dev.id}`}
                            className='font-semibold text-foreground hover:text-primary text-sm transition-colors'
                          >
                            {dev.firstName} {dev.lastName}
                          </Link>
                          {dev.location && (
                            <p className='text-xs text-muted-foreground truncate'>
                              📍 {dev.location}
                            </p>
                          )}
                        </div>
                      </div>
                      {dev.bio && (
                        <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                          {dev.bio}
                        </p>
                      )}
                      <div className='flex flex-wrap gap-1.5 mb-4'>
                        {dev.skills.slice(0, 3).map((s) => (
                          <span key={s} className='tag-primary'>
                            {s}
                          </span>
                        ))}
                        {dev.skills.length > 3 && (
                          <span className='tag-muted'>
                            +{dev.skills.length - 3}
                          </span>
                        )}
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => handleConnect(dev.id)}
                          className='flex-1'
                          size='sm'
                        >
                          Connect
                        </Button>
                        <Button
                          as={Link}
                          to={`/profile/${dev.id}`}
                          className='flex-1'
                          variant='secondary'
                          size='sm'
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination for devs */}
                {searchResults?.pagination &&
                  searchResults.pagination.totalPages > 1 && (
                    <div className='flex justify-center items-center gap-4 mt-6'>
                      <Button
                        onClick={() => setDevPage((p) => Math.max(1, p - 1))}
                        disabled={devPage === 1}
                        variant='secondary'
                      >
                        ← Previous
                      </Button>
                      <span className='text-sm text-muted-foreground'>
                        Page {devPage} of {searchResults.pagination.totalPages}
                      </span>
                      <Button
                        onClick={() => setDevPage((p) => p + 1)}
                        disabled={
                          devPage === searchResults.pagination.totalPages
                        }
                        variant='secondary'
                      >
                        Next →
                      </Button>
                    </div>
                  )}
              </div>
            )}

          {/* Projects Section */}
          {(activeTab === 'all' || activeTab === 'projects') &&
            projects.length > 0 && (
              <div className='mb-8'>
                <h2 className='section-title mb-4'>Projects</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {projects.map((project) => (
                    <div key={project.id} className='card-modern p-5'>
                      <div className='flex justify-between items-start mb-3'>
                        <Link
                          to={`/projects/${project.id}`}
                          className='font-semibold text-foreground hover:text-primary transition-colors'
                        >
                          {project.title}
                        </Link>
                        <span
                          className={`tag-${project.status === 'ACTIVE' ? 'success' : 'muted'} shrink-0 ml-2`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
                        {project.description}
                      </p>
                      <div className='flex flex-wrap gap-1.5 mb-4'>
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className='tag-primary'>
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-muted-foreground'>
                          {project.members.length} members
                        </span>
                        {project.openRoles.length > 0 && (
                          <Button
                            onClick={() => handleApply(project)}
                            variant='accent'
                            size='sm'
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination for projects */}
                {projectsData?.pagination &&
                  projectsData.pagination.totalPages > 1 && (
                    <div className='flex justify-center items-center gap-4 mt-6'>
                      <Button
                        onClick={() =>
                          setProjectPage((p) => Math.max(1, p - 1))
                        }
                        disabled={projectPage === 1}
                        variant='secondary'
                      >
                        ← Previous
                      </Button>
                      <span className='text-sm text-muted-foreground'>
                        Page {projectPage} of{' '}
                        {projectsData.pagination.totalPages}
                      </span>
                      <Button
                        onClick={() => setProjectPage((p) => p + 1)}
                        disabled={
                          projectPage === projectsData.pagination.totalPages
                        }
                        variant='secondary'
                      >
                        Next →
                      </Button>
                    </div>
                  )}
              </div>
            )}

          {/* Empty State */}
          {developers.length === 0 && projects.length === 0 && (
            <div className='card-modern p-12 text-center'>
              <div className='text-4xl mb-4'>◎</div>
              <p className='text-foreground font-medium mb-2'>
                No results found
              </p>
              <p className='text-sm text-muted-foreground'>
                Try different search terms or skill filters.
              </p>
            </div>
          )}
        </>
      )}
      {/* Application Modal */}
      <AnimatePresence>
        {applyingTo && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 bg-black/60 backdrop-blur-sm'
              onClick={() => setApplyingTo(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className='relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-glow overflow-hidden z-10'
            >
              <div className='gradient-primary h-2' />
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h3 className='text-xl font-bold text-foreground'>
                      Join Collaboration
                    </h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Applying for {applyingTo.title}
                    </p>
                  </div>
                  <Button
                    onClick={() => setApplyingTo(null)}
                    variant='ghost'
                    size='icon'
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>

                <form onSubmit={submitApplication} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground/80 mb-1.5 flex items-center gap-2'>
                      <Briefcase className='h-4 w-4' /> Select Role
                    </label>
                    <select
                      className='input-modern'
                      value={appData.role}
                      onChange={(e) =>
                        setAppData({ ...appData, role: e.target.value })
                      }
                      required
                    >
                      {applyingTo.openRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      <option value='Contributor'>Contributor</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-foreground/80 mb-1.5 flex items-center gap-2'>
                      <Send className='h-4 w-4' /> Introduction Message
                    </label>
                    <textarea
                      className='input-modern min-h-[120px] resize-none'
                      placeholder="Explain why you're a good fit for this project..."
                      value={appData.message}
                      onChange={(e) =>
                        setAppData({ ...appData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className='pt-2 flex gap-3'>
                    <Button
                      type='button'
                      onClick={() => setApplyingTo(null)}
                      className='flex-1'
                      variant='secondary'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={applyToProject.isPending}
                      className='flex-1 shadow-glow'
                    >
                      {applyToProject.isPending
                        ? 'Submitting...'
                        : 'Send Application'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
