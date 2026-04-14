import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useSearchUsers, useTrendingSkills } from '@/hooks/useUser';
import { useProjects, useApplyToProject } from '@/hooks/useProjects';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';

export default function ExplorePage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [devPage, setDevPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'developers' | 'projects'>('all');

  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(
    { 
      query: searchQuery || undefined,
      skills: selectedSkill || undefined,
      page: devPage
    },
    true
  );
  
  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    search: searchQuery || undefined,
    page: projectPage
  });
  const { data: trendingSkills } = useTrendingSkills();

  const sendRequest = useSendConnectionRequest();
  const applyToProject = useApplyToProject();

  const developers = (searchResults?.data || []).filter((d) => d.id !== user?.id);
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

  const handleApply = async (projectId: string) => {
    try {
      await applyToProject.mutateAsync({
        projectId,
        data: { role: 'Contributor', message: 'I would love to contribute to this project!' },
      });
      toast.success('Application submitted!');
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
      <div className="page-header">
        <h1 className="page-title">Explore</h1>
        <p className="page-subtitle">Discover developers and projects across the community</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">◎</span>
          <input
            type="text"
            placeholder="Search developers, projects, or skills…"
            className="input-modern pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Trending Skills */}
      {!searchQuery && trendingSkills && trendingSkills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Trending Skills</h3>
          <div className="flex flex-wrap gap-2">
            {trendingSkills.map((skill) => (
              <button
                key={skill.skill}
                onClick={() => handleSkillClick(skill.skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedSkill === skill.skill 
                    ? 'gradient-primary text-white border-primary/30 shadow-glow' 
                    : 'bg-card/60 border-border/50 text-foreground/70 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {skill.skill}
                <span className={`ml-1.5 text-xs ${selectedSkill === skill.skill ? 'text-white/70' : 'text-primary'}`}>
                  {skill.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-card/40 rounded-lg p-1 border border-border/30 w-fit">
        {(['all', 'developers', 'projects'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' && `All (${developers.length + projects.length})`}
            {tab === 'developers' && `Developers (${developers.length})`}
            {tab === 'projects' && `Projects (${projects.length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-modern p-6 animate-pulse space-y-3">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-3 w-1/3 bg-muted rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-14 bg-muted rounded" />
                <div className="h-6 w-14 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Developers Section */}
          {(activeTab === 'all' || activeTab === 'developers') && developers.length > 0 && (
            <div className="mb-8">
              <h2 className="section-title mb-4">Developers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {developers.map((dev) => (
                  <div key={dev.id} className="card-modern p-5">
                    <div className="flex items-start gap-3 mb-3">
                      {dev.avatarUrl ? (
                        <img src={dev.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
                      ) : (
                        <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                          {dev.firstName[0]}{dev.lastName[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/profile/${dev.id}`}
                          className="font-semibold text-foreground hover:text-primary text-sm transition-colors"
                        >
                          {dev.firstName} {dev.lastName}
                        </Link>
                        {dev.location && (
                          <p className="text-xs text-muted-foreground truncate">📍 {dev.location}</p>
                        )}
                      </div>
                    </div>
                    {dev.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dev.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dev.skills.slice(0, 3).map((s) => (
                        <span key={s} className="tag-primary">{s}</span>
                      ))}
                      {dev.skills.length > 3 && (
                        <span className="tag-muted">+{dev.skills.length - 3}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConnect(dev.id)}
                        className="btn-primary flex-1 text-xs py-2"
                      >
                        Connect
                      </button>
                      <Link
                        to={`/profile/${dev.id}`}
                        className="btn-secondary text-xs py-2 text-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination for devs */}
              {searchResults?.pagination && searchResults.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button onClick={() => setDevPage(p => Math.max(1, p - 1))} disabled={devPage === 1} className="btn-secondary disabled:opacity-50">
                    ← Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {devPage} of {searchResults.pagination.totalPages}
                  </span>
                  <button onClick={() => setDevPage(p => p + 1)} disabled={devPage === searchResults.pagination.totalPages} className="btn-secondary disabled:opacity-50">
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Projects Section */}
          {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
            <div className="mb-8">
              <h2 className="section-title mb-4">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="card-modern p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                      <span className={`tag-${project.status === 'ACTIVE' ? 'success' : 'muted'} shrink-0 ml-2`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="tag-primary">{tech}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{project.members.length} members</span>
                      {project.openRoles.length > 0 && (
                        <button
                          onClick={() => handleApply(project.id)}
                          className="btn-accent text-xs py-1.5 px-3"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination for projects */}
              {projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button onClick={() => setProjectPage(p => Math.max(1, p - 1))} disabled={projectPage === 1} className="btn-secondary disabled:opacity-50">
                    ← Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {projectPage} of {projectsData.pagination.totalPages}
                  </span>
                  <button onClick={() => setProjectPage(p => p + 1)} disabled={projectPage === projectsData.pagination.totalPages} className="btn-secondary disabled:opacity-50">
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {developers.length === 0 && projects.length === 0 && (
            <div className="card-modern p-12 text-center">
              <div className="text-4xl mb-4">◎</div>
              <p className="text-foreground font-medium mb-2">No results found</p>
              <p className="text-sm text-muted-foreground">Try different search terms or skill filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
