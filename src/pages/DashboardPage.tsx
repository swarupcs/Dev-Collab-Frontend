import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useProjects, useMyInvitations, useRespondToInvitation } from '@/hooks/useProjects';
import { useConnections } from '@/hooks/useConnections';
import { toast } from 'sonner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: invitations, isLoading: invitationsLoading } = useMyInvitations();
  const respondToInvitation = useRespondToInvitation();

  const handleRespondInvitation = async (projectId: string, invitationId: string, accept: boolean) => {
    try {
      await respondToInvitation.mutateAsync({ projectId, invitationId, accept });
      toast.success(accept ? 'Invitation accepted!' : 'Invitation declined.');
    } catch {
      toast.error('Failed to respond to invitation.');
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card-modern p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="page-title text-2xl lg:text-3xl">
            Welcome back, <span className="text-gradient-primary">{user?.firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Ready to collaborate on amazing projects? Here's your workspace overview.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Projects</p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {projectsLoading ? <span className="inline-block w-8 h-8 rounded bg-muted animate-pulse" /> : projectsData?.data.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Connections</p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {connectionsLoading ? <span className="inline-block w-8 h-8 rounded bg-muted animate-pulse" /> : connections?.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Skills</p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {user?.skills.length || 0}
          </p>
        </div>
      </div>

      {/* Pending Invitations */}
      {!invitationsLoading && invitations && invitations.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Pending Invitations
          </h2>
          <div className="space-y-3">
            {invitations.map((inv: any) => (
              <div key={inv.id} className="card-modern p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Invitation for <span className="text-primary">{inv.project.title || 'Project'}</span>
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="tag-primary">{inv.role}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespondInvitation(inv.project.id || inv.project, inv.id, false)}
                    disabled={respondToInvitation.isPending}
                    className="btn-danger text-xs px-4 py-2"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleRespondInvitation(inv.project.id || inv.project, inv.id, true)}
                    disabled={respondToInvitation.isPending}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="card-modern p-6 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg group-hover:scale-110 transition-transform">
              ◈
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Browse Projects</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Find exciting projects to collaborate on
          </p>
        </button>
        
        <button
          onClick={() => navigate('/connections')}
          className="card-modern p-6 text-left group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-lg group-hover:scale-110 transition-transform">
              ⬢
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">Connect with Developers</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Build your professional network
          </p>
        </button>
      </div>

      {/* Recent Projects */}
      {!projectsLoading && projectsData && projectsData.data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Projects</h2>
            <button onClick={() => navigate('/projects')} className="text-sm text-primary hover:text-primary/80 transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {projectsData.data.slice(0, 3).map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="card-modern p-5 w-full text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                  </div>
                  <span className={`tag-${project.status === 'ACTIVE' ? 'success' : 'muted'} shrink-0`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tag-primary">{tech}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
