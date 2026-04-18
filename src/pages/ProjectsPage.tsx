import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import type { ProjectQuery } from '@/services/project.service';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    ownership: '',
  });
  const [page, setPage] = useState(1);

  const query: ProjectQuery = { page };
  if (filters.search) query.search = filters.search;
  if (filters.status) query.status = filters.status as ProjectQuery['status'];
  if (filters.ownership) query.ownership = filters.ownership as ProjectQuery['ownership'];

  const { data: projectsData, isLoading } = useProjects(query);
  const createProject = useCreateProject();
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    openRoles: '',
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProject.mutateAsync({
        title: newProject.title,
        description: newProject.description,
        techStack: newProject.techStack.split(',').map(s => s.trim()),
        openRoles: newProject.openRoles.split(',').map(s => s.trim()).filter(Boolean),
      });
      
      setShowCreateForm(false);
      setNewProject({ title: '', description: '', techStack: '', openRoles: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and discover collaboration opportunities</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={showCreateForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showCreateForm ? 'Cancel' : '+ Create Project'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search projects…"
          className="input-modern max-w-xs"
          value={filters.search}
          onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPage(1); }}
        />
        <select
          className="input-modern max-w-[160px]"
          value={filters.status}
          onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          className="input-modern max-w-[160px]"
          value={filters.ownership}
          onChange={(e) => { setFilters(prev => ({ ...prev, ownership: e.target.value })); setPage(1); }}
        >
          <option value="">All Ownership</option>
          <option value="mine">My Projects</option>
          <option value="member">I'm a Member</option>
          <option value="applied">Applied</option>
        </select>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="card-modern p-6 mb-6">
          <h3 className="section-title mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                required
                className="input-modern"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Description
              </label>
              <textarea
                required
                rows={3}
                className="input-modern resize-none"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                  Tech Stack <span className="text-muted-foreground">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB"
                  className="input-modern"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                  Open Roles <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Frontend Developer, Designer"
                  className="input-modern"
                  value={newProject.openRoles}
                  onChange={(e) => setNewProject({ ...newProject, openRoles: e.target.value })}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={createProject.isPending}
              className="btn-primary w-full"
            >
              {createProject.isPending ? 'Creating…' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-modern p-6 space-y-3 animate-pulse">
              <div className="h-5 w-2/3 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projectsData?.data.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <div className="text-4xl mb-4">◈</div>
          <p className="text-foreground font-medium mb-2">No projects yet</p>
          <p className="text-sm text-muted-foreground">Create your first project to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsData?.data.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="card-modern p-6 text-left group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <span className={`tag-${project.status === 'ACTIVE' ? 'success' : 'muted'} shrink-0 ml-2`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="tag-primary">{tech}</span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="tag-muted">+{project.techStack.length - 3}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{project.members.length} members</span>
                <span>{project.owner.firstName} {project.owner.lastName}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && projectsData?.pagination && projectsData.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {projectsData.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === projectsData.pagination.totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
