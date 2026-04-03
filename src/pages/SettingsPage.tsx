import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  LogOut,
  Shield,
  Palette,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageTransition } from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, signOut, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    connections: true,
    messages: true,
    projects: true,
    marketing: false,
  });

  const handleVisibilityToggle = () => {
    const newVisibility = user?.visibility === 'public' ? 'private' : 'public';
    updateUser({ visibility: newVisibility });
    toast.success(`Profile is now ${newVisibility}`);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
    toast.success('Signed out successfully');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };

      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${updated[key] ? 'enabled' : 'disabled'}`);
      return updated;
    });
  };

  return (
    <div className='min-h-screen bg-background grid-pattern'>
      <DashboardHeader
        backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}
      />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className='text-2xl font-heading font-bold mb-8'>Settings</h1>
          </motion.div>

          <div className='space-y-6'>
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className='glass border-border/50 shadow-card'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <Palette className='h-5 w-5' />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your interface.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {theme === 'dark' ? (
                        <Moon className='h-5 w-5 text-primary' />
                      ) : (
                        <Sun className='h-5 w-5 text-primary' />
                      )}
                      <div>
                        <Label className='text-sm font-medium'>Dark Mode</Label>
                        <p className='text-xs text-muted-foreground'>
                          Switch between light and dark themes
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className='glass border-border/50 shadow-card'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <Shield className='h-5 w-5' />
                    Privacy
                  </CardTitle>
                  <CardDescription>
                    Control your profile visibility and data sharing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {user?.visibility === 'public' ? (
                        <Eye className='h-5 w-5 text-primary' />
                      ) : (
                        <EyeOff className='h-5 w-5 text-muted-foreground' />
                      )}
                      <div>
                        <Label className='text-sm font-medium'>
                          Public Profile
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          {user?.visibility === 'public'
                            ? 'Your profile is visible to all developers'
                            : 'Your profile is hidden from discovery'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user?.visibility === 'public'}
                      onCheckedChange={handleVisibilityToggle}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className='glass border-border/50 shadow-card'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <Bell className='h-5 w-5' />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {[
                    {
                      key: 'connections' as const,
                      label: 'Connection Requests',
                      desc: 'When someone wants to connect',
                    },
                    {
                      key: 'messages' as const,
                      label: 'Messages',
                      desc: 'New direct messages',
                    },
                    {
                      key: 'projects' as const,
                      label: 'Project Updates',
                      desc: 'Updates from your projects',
                    },
                    {
                      key: 'marketing' as const,
                      label: 'Marketing Emails',
                      desc: 'Tips, news, and product updates',
                    },
                  ].map((item, i) => (
                    <div key={item.key}>
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label className='text-sm font-medium'>
                            {item.label}
                          </Label>
                          <p className='text-xs text-muted-foreground'>
                            {item.desc}
                          </p>
                        </div>
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={() => toggleNotification(item.key)}
                        />
                      </div>
                      {i < 3 && <Separator className='mt-4' />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Account */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className='glass border-border/50 shadow-card'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 font-heading'>
                    <LogOut className='h-5 w-5' />
                    Account
                  </CardTitle>
                  <CardDescription>
                    Manage your account and session.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center justify-between p-3 rounded-xl bg-muted/30'>
                    <div>
                      <p className='text-sm font-medium'>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='destructive'
                    className='w-full'
                    onClick={handleLogout}
                  >
                    <LogOut className='h-4 w-4 mr-2' />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
