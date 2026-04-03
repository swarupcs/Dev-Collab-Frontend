import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Check,
  MessageSquare,
  UserPlus,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notificationsApi } from '@/services/mockApi';
import type { Notification } from '@/services/mockData';

const iconMap: Record<string, React.ReactNode> = {
  connection: <UserPlus className='h-4 w-4 text-primary' />,
  message: <MessageSquare className='h-4 w-4 text-primary' />,
  project: <FolderOpen className='h-4 w-4 text-accent-foreground' />,
  system: <Sparkles className='h-4 w-4 text-muted-foreground' />,
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    notificationsApi.getAll().then(setNotifications);
  }, []);

  const markAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 h-4 w-4 rounded-full gradient-primary text-[10px] text-primary-foreground font-bold flex items-center justify-center'>
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80 glass p-0' align='end'>
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50'>
          <h4 className='font-heading font-semibold text-sm'>Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs h-7'
              onClick={markAllRead}
            >
              <Check className='h-3 w-3 mr-1' />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className='max-h-80'>
          {notifications.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div className='mt-0.5'>{iconMap[n.type]}</div>
                <div className='flex-1 min-w-0'>
                  <p className={`text-sm ${!n.read ? 'font-medium' : ''}`}>
                    {n.message}
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {n.time}
                  </p>
                </div>
                {!n.read && (
                  <div className='h-2 w-2 rounded-full gradient-primary mt-2 shrink-0' />
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
