import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useProjects, useMyInvitations, useRespondToInvitation } from '@/hooks/useProjects';
import { useConnections } from '@/hooks/useConnections';
import { useActivities } from '@/hooks/useActivity';
import { toast } from 'sonner';
import { Activity, Search, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: invitations, isLoading: invitationsLoading } = useMyInvitations();
  const respondToInvitation = useRespondToInvitation();

  const { data: activities, isLoading: activitiesLoading } = useActivities();

  const handleRespondInvitation = async (
    projectId: string,
    invitationId: string,
    accept: boolean
  ) => {
    try {
      await respondToInvitation.mutateAsync({ projectId, invitationId, accept });
      toast.success(accept ? 'Invitation accepted!' : 'Invitation declined.');
    } catch {
      toast.error('Failed to respond to invitation.');
    }
  };

  const unreadCount = activities?.filter((a) => !a.read).length || 0;

  return (
    <>
      <div className="card-modern p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="page-title text-2xl lg:text-3xl">
            Welcome back, <span className="text-gradient-primary">{user?.firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Check your latest notifications and progress across your workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Projects
          </p>
          <p className="text-3xl font-bold text-foreground">
            {projectsLoading ? '...' : projectsData?.data.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Connections
          </p>
          <p className="text-3xl font-bold text-foreground">
            {connectionsLoading ? '...' : connections?.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Unread
          </p>
          <p className="text-3xl font-bold text-accent">{unreadCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            Skills
          </p>
          <p className="text-3xl font-bold text-foreground">
            {user?.skills.length || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {!invitationsLoading && invitations && invitations.length > 0 && (
            <div>
              <h2 className="section-title mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent" />
                Pending Invitations
              </h2>
              <div className="space-y-3">
                {invitations.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="card-modern p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        Invitation for <span className="text-primary">{inv.project.title || 'Project'}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="tag-primary">{inv.role}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRespondInvitation(
                            inv.project.id || inv.project,
                            inv.id,
                            false
                          )
                        }
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleRespondInvitation(
                            inv.project.id || inv.project,
                            inv.id,
                            true
                          )
                        }
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Recent Activity</h2>
            </div>
            <div className="card-modern">
              <div className="divide-y divide-border/50">
                {activitiesLoading ? (
                  <div className="p-8 text-center">
                    <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
                  </div>
                ) : activities?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No recent activities.
                  </div>
                ) : (
                  activities?.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 flex items-center gap-3 transition-colors ${
                        !activity.read ? 'bg-primary/5' : 'hover:bg-muted/20'
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          !activity.read
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {activity.type.includes('CONNECTION') ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {activity.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            activity.createdAt
                          ).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-modern p-5 bg-gradient-to-br from-card/80 to-primary/5">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Discover
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Search for projects, developers, and discussions across the network.
            </p>
            <Button
              onClick={() => navigate('/explore')}
              className="w-full justify-center"
              size="lg"
            >
              Explore Network
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

