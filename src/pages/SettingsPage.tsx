import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useLogout, useLogoutAll, useChangePassword } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUser';
import { toast } from 'sonner';

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const logoutMutation = useLogout();
  const logoutAllMutation = useLogoutAll();
  const changePassword = useChangePassword();
  const updateProfile = useUpdateProfile();

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleVisibilityToggle = async () => {
    const newVisibility = user?.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    try {
      await updateProfile.mutateAsync({ visibility: newVisibility });
      toast.success(`Profile is now ${newVisibility.toLowerCase()}`);
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
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully. You will need to log in again.');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      toast.error('Failed to change password. Check your current password.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllMutation.mutateAsync();
      navigate('/login');
      toast.success('Signed out from all devices');
    } catch {
      toast.error('Failed to sign out from all devices');
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Privacy */}
        <div className="card-modern p-6">
          <h2 className="section-title mb-1">Privacy</h2>
          <p className="text-sm text-muted-foreground mb-5">Control your profile visibility.</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Public Profile</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.visibility === 'PUBLIC'
                  ? 'Your profile is visible to all developers'
                  : 'Your profile is hidden from discovery'}
              </p>
            </div>
            <button
              onClick={handleVisibilityToggle}
              disabled={updateProfile.isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                user?.visibility === 'PUBLIC' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  user?.visibility === 'PUBLIC' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="card-modern p-6">
          <h2 className="section-title mb-1">Change Password</h2>
          <p className="text-sm text-muted-foreground mb-5">Update your account password. You will be logged out of all devices.</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                className="input-modern"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="input-modern"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="input-modern"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="btn-primary w-full"
            >
              {changePassword.isPending ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account */}
        <div className="card-modern p-6">
          <h2 className="section-title mb-1">Account</h2>
          <p className="text-sm text-muted-foreground mb-5">Manage your account and sessions.</p>
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30 mb-4">
            <p className="text-sm font-medium text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="btn-danger w-full"
            >
              {logoutMutation.isPending ? 'Signing out…' : 'Sign Out'}
            </button>
            <button
              onClick={handleLogoutAll}
              disabled={logoutAllMutation.isPending}
              className="btn-secondary w-full text-destructive"
            >
              {logoutAllMutation.isPending ? 'Signing out…' : 'Sign Out from All Devices'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
