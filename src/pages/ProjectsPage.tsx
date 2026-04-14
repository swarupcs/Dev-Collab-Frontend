import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useAppSelector } from '@/store/hooks';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { data: projectsData, isLoading } = useProjects();
  const createProject = useCreateProject();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showCreateForm ? 'Cancel' : 'Create Project'}
          </button>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Roles (comma-separated, optional)
                </label>
                <input
                  type="text"
                  placeholder="Frontend Developer, Designer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={newProject.openRoles}
                  onChange={(e) => setNewProject({ ...newProject, openRoles: e.target.value })}
                />
              </div>
              
              <button
                type="submit"
                disabled={createProject.isPending}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projectsData?.data.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.data.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.members.length} members</span>
                  <span>{project.owner.firstName} {project.owner.lastName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
