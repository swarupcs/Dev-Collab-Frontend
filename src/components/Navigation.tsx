import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useLogout } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/projects' },
  { label: 'Connections', href: '/connections' },
  { label: 'Explore', href: '/explore' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
              Dev-Collab
            </Link>
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
