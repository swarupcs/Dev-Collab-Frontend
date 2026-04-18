import { useActivities, useMarkAsRead } from '@/hooks/useActivity';
import { toast } from 'sonner';
import { Activity, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ActivityPage() {
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAsRead = async () => {
    try {
      await markAsReadMutation.mutateAsync();
      toast.success('All activities marked as read');
    } catch {
      toast.error('Failed to mark activities as read');
    }
  };

  const unreadCount = activities?.filter((a) => !a.read).length || 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Activity Feed</h1>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAsRead} disabled={markAsReadMutation.isPending} variant="outline" size="sm">
            <CheckSquare className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {activitiesLoading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`card-modern p-5 flex items-start gap-4 transition-all ${
                !activity.read ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  !activity.read
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm md:text-base text-foreground font-medium">
                  {activity.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
              {!activity.read && (
                <div
                  className="h-2 w-2 rounded-full bg-primary ml-auto mt-2"
                  title="Unread"
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-12 card-modern rounded-xl border-dashed border-border/50">
            <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              You have no activities yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
