import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useLogout } from '@/hooks/useAuth';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/projects', label: 'Projects', icon: '◈' },
  { to: '/explore', label: 'Explore', icon: '◎' },
  { to: '/connections', label: 'Connections', icon: '⬢' },
  { to: '/discussion', label: 'Forum', icon: '▣' },
  { to: '/chat', label: 'Messages', icon: '✉' },
  { to: '/profile', label: 'Profile', icon: '◉' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const logoutMutation = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/80 backdrop-blur-2xl border-r border-sidebar-border/50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-sidebar-border/50">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow">
              DC
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              Dev-Collab
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full btn-danger text-xs py-2"
          >
            {logoutMutation.isPending ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 rounded-lg border border-border/50 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
          >
            ☰
          </button>
          <span className="font-bold text-foreground text-sm tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Dev-Collab
          </span>
          <div className="h-9 w-9" /> {/* Spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
