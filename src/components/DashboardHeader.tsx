import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useLogout } from '@/hooks/useAuth';

interface DashboardHeaderProps {
  title?: string;
  backTo?: { label: string; href: string };
}

export function DashboardHeader({ title, backTo }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {backTo && (
              <Link to={backTo.href} className="text-indigo-600 hover:text-indigo-700 text-sm">
                ← {backTo.label}
              </Link>
            )}
            {title && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
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
    </header>
  );
}
