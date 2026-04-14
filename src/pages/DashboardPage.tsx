import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useConnections } from '@/hooks/useConnections';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const logout = useLogout();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: connections, isLoading: connectionsLoading } = useConnections();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dev-Collab</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="text-gray-700 hover:text-indigo-600"
            >
              Projects
            </button>
            <button
              onClick={() => navigate('/connections')}
              className="text-gray-700 hover:text-indigo-600"
            >
              Connections
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-700 hover:text-indigo-600"
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Projects</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {projectsLoading ? '...' : projectsData?.data.length || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Connections</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {connectionsLoading ? '...' : connections?.length || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Skills</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {user?.skills.length || 0}
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600 mb-6">
            Ready to collaborate on amazing projects? Here's what you can do:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Browse Projects</h3>
              <p className="text-sm text-gray-600">
                Find exciting projects to collaborate on
              </p>
            </button>
            
            <button
              onClick={() => navigate('/connections')}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Connect with Developers</h3>
              <p className="text-sm text-gray-600">
                Build your professional network
              </p>
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        {!projectsLoading && projectsData && projectsData.data.length > 0 && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
            <div className="space-y-4">
              {projectsData.data.slice(0, 3).map((project) => (
                <div key={project.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex gap-2 mt-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
