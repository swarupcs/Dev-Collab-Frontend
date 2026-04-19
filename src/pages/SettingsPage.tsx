import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useLogout, useLogoutAll, useChangePassword } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUser';
import { toast } from 'sonner';
import {
  Shield,
  Palette,
  Bell,
  Key,
  LogOut,
  MonitorSmartphone,
  Settings as SettingsIcon,
  UserCircle,
  Globe,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TABS = [
  { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Key },
  { id: 'account', label: 'Account & Sessions', icon: UserCircle },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const logoutMutation = useLogout();
  const logoutAllMutation = useLogoutAll();
  const changePassword = useChangePassword();
  const updateProfile = useUpdateProfile();

  const [activeTab, setActiveTab] = useState('privacy');
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleVisibilityToggle = async () => {
    const newVisibility = user?.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    try {
      await updateProfile.mutateAsync({ visibility: newVisibility });
      toast.success(
        `Profile visibility updated to ${newVisibility.toLowerCase()}`,
      );
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword.mutateAsync({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully. Please log in again.');
      setTimeout(() => navigate('/signin'), 2000);
    } catch {
      toast.error('Failed to change password. Check your current password.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/signin');
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllMutation.mutateAsync();
      navigate('/signin');
      toast.success('Signed out from all devices');
    } catch {
      toast.error('Failed to sign out from all devices');
    }
  };

  return (
    <div className='container mx-auto max-w-[1200px] py-8 px-4 sm:px-6 min-h-screen'>
      {/* Enhanced Page Header */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background border border-border/50 p-8 sm:p-10 mb-10 shadow-sm'>
        <div className='absolute top-0 right-0 p-12 opacity-5 pointer-events-none'>
          <SettingsIcon className='w-64 h-64 text-foreground transform rotate-12 translate-x-8 -translate-y-12' />
        </div>
        <div className='relative z-10 max-w-2xl'>
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3'>
            Settings
          </h1>
          <p className='text-muted-foreground text-base sm:text-lg leading-relaxed'>
            Manage your account preferences, security, and personalize your
            experience.
          </p>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
        {/* Settings Navigation Sidebar */}
        <aside className='w-full lg:w-64 shrink-0'>
          <div className='sticky top-24'>
            <div className='bg-card border border-border/50 rounded-3xl p-3 shadow-sm'>
              <nav className='space-y-1 relative'>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId='activeSettingsTab'
                          className='absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20'
                          initial={false}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className='relative z-10 flex items-center gap-3 w-full'>
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 min-w-0'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='space-y-8'
            >
              {activeTab === 'privacy' && (
                <section className='bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 rounded-xl bg-primary/10 text-primary'>
                      <Shield className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Privacy & Visibility
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Control who can see your profile and activity.
                      </p>
                    </div>
                  </div>

                  <div className='p-5 rounded-2xl border border-border/50 bg-background flex items-center justify-between gap-4'>
                    <div className='flex gap-4 items-start'>
                      <Globe className='h-5 w-5 text-muted-foreground mt-0.5' />
                      <div>
                        <p className='text-sm font-bold text-foreground'>
                          Public Profile
                        </p>
                        <p className='text-sm text-muted-foreground mt-1 max-w-md'>
                          {user?.visibility === 'PUBLIC'
                            ? 'Your profile is currently visible to all developers on the platform.'
                            : 'Your profile is hidden from discovery and search results.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleVisibilityToggle}
                      disabled={updateProfile.isPending}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        user?.visibility === 'PUBLIC'
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      <span className='sr-only'>Toggle Public Profile</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          user?.visibility === 'PUBLIC'
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </section>
              )}

              {activeTab === 'appearance' && (
                <section className='bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 rounded-xl bg-primary/10 text-primary'>
                      <Palette className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Appearance
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Customize your UI theme and preferences.
                      </p>
                    </div>
                  </div>

                  <div className='p-5 rounded-2xl border border-border/50 bg-background flex items-center justify-between gap-4'>
                    <div className='flex gap-4 items-start'>
                      <Palette className='h-5 w-5 text-muted-foreground mt-0.5' />
                      <div>
                        <p className='text-sm font-bold text-foreground'>
                          Dark Mode
                        </p>
                        <p className='text-sm text-muted-foreground mt-1 max-w-md'>
                          Currently, the application forces a high-contrast dark
                          theme for optimal developer experience.
                        </p>
                      </div>
                    </div>
                    <button
                      disabled
                      className='relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 bg-primary opacity-80 cursor-not-allowed'
                    >
                      <span className='inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 translate-x-6' />
                    </button>
                  </div>
                </section>
              )}

              {activeTab === 'notifications' && (
                <section className='bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 rounded-xl bg-primary/10 text-primary'>
                      <Bell className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Notifications
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Manage your alerts and email communications.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='p-5 rounded-2xl border border-border/50 bg-background flex items-center justify-between gap-4'>
                      <div className='flex gap-4 items-start'>
                        <Mail className='h-5 w-5 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm font-bold text-foreground'>
                            Email Notifications
                          </p>
                          <p className='text-sm text-muted-foreground mt-1 max-w-md'>
                            Receive digests, mentions, and important system
                            alerts directly to your inbox.
                          </p>
                        </div>
                      </div>
                      <button className='relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
                        <span className='inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 translate-x-6' />
                      </button>
                    </div>

                    <div className='p-5 rounded-2xl border border-border/50 bg-background flex items-center justify-between gap-4'>
                      <div className='flex gap-4 items-start'>
                        <Bell className='h-5 w-5 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm font-bold text-foreground'>
                            Marketing & News
                          </p>
                          <p className='text-sm text-muted-foreground mt-1 max-w-md'>
                            Receive occasional platform updates, feature
                            announcements, and developer news.
                          </p>
                        </div>
                      </div>
                      <button className='relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
                        <span className='inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 translate-x-1' />
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'security' && (
                <section className='bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 rounded-xl bg-primary/10 text-primary'>
                      <Key className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Security
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Update your account password and secure your profile.
                      </p>
                    </div>
                  </div>

                  <div className='bg-background rounded-2xl border border-border/50 p-6'>
                    <form
                      onSubmit={handleChangePassword}
                      className='max-w-md space-y-5'
                    >
                      <div className='space-y-2'>
                        <label className='text-sm font-semibold text-foreground'>
                          Current Password
                        </label>
                        <Input
                          type='password'
                          required
                          className='h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl'
                          value={passwordForm.oldPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              oldPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-semibold text-foreground'>
                          New Password
                        </label>
                        <Input
                          type='password'
                          required
                          minLength={6}
                          className='h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl'
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                        />
                        <p className='text-xs text-muted-foreground'>
                          Must be at least 6 characters long.
                        </p>
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-semibold text-foreground'>
                          Confirm New Password
                        </label>
                        <Input
                          type='password'
                          required
                          minLength={6}
                          className='h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl'
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        type='submit'
                        disabled={changePassword.isPending}
                        className='w-full h-11 rounded-xl shadow-sm mt-2'
                      >
                        {changePassword.isPending
                          ? 'Updating...'
                          : 'Update Password'}
                      </Button>
                    </form>
                  </div>
                </section>
              )}

              {activeTab === 'account' && (
                <section className='bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 rounded-xl bg-destructive/10 text-destructive'>
                      <UserCircle className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-foreground'>
                        Account & Sessions
                      </h2>
                      <p className='text-sm text-muted-foreground'>
                        Manage your active sessions and account actions.
                      </p>
                    </div>
                  </div>

                  <div className='bg-background rounded-2xl border border-border/50 p-6 mb-6 flex items-center gap-4'>
                    <div className='h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/20'>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className='text-lg font-bold text-foreground'>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4 max-w-md'>
                    <div className='p-5 rounded-2xl border border-border/50 bg-background'>
                      <div className='flex items-start gap-4 mb-4'>
                        <LogOut className='h-5 w-5 text-muted-foreground mt-0.5' />
                        <div>
                          <p className='text-sm font-bold text-foreground'>
                            Sign Out
                          </p>
                          <p className='text-sm text-muted-foreground mt-1'>
                            Log out of your current session on this browser.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='secondary'
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className='w-full h-11 rounded-xl font-semibold bg-muted hover:bg-muted/80'
                      >
                        {logoutMutation.isPending
                          ? 'Signing out...'
                          : 'Sign Out'}
                      </Button>
                    </div>

                    <div className='p-5 rounded-2xl border border-destructive/20 bg-destructive/5'>
                      <div className='flex items-start gap-4 mb-4'>
                        <MonitorSmartphone className='h-5 w-5 text-destructive mt-0.5' />
                        <div>
                          <p className='text-sm font-bold text-destructive'>
                            Sign Out from All Devices
                          </p>
                          <p className='text-sm text-destructive/80 mt-1'>
                            Invalidate all active sessions across all your
                            devices immediately.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='destructive'
                        onClick={handleLogoutAll}
                        disabled={logoutAllMutation.isPending}
                        className='w-full h-11 rounded-xl font-semibold shadow-sm'
                      >
                        {logoutAllMutation.isPending
                          ? 'Signing out...'
                          : 'Sign Out Everywhere'}
                      </Button>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
