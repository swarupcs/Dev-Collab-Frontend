import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Compass,
  MessagesSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const dashboardLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
  { to: '/chat', label: 'Messages', icon: MessageSquare },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/discussion', label: 'Discussion', icon: MessagesSquare },
];

interface DashboardHeaderProps {
  title?: string;
  backTo?: { label: string; href: string };
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  backTo,
  actions,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'DC';
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-14 items-center justify-between gap-4'>
          {/* Left: Logo + Nav or Back */}
          <div className='flex items-center gap-4 min-w-0'>
            {backTo ? (
              <Link
                to={backTo.href}
                className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group'
              >
                <ChevronLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' />
                <span className='truncate'>{backTo.label}</span>
              </Link>
            ) : (
              <>
                <Link to='/' className='flex items-center gap-2 group shrink-0'>
                  <div className='h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:scale-105'>
                    <span className='text-primary-foreground font-bold text-xs font-heading tracking-tight'>
                      DC
                    </span>
                  </div>
                </Link>
                {/* Inline nav links */}
                <nav className='hidden lg:flex items-center'>
                  <div className='flex items-center bg-muted/50 rounded-full px-1 py-1 gap-0.5'>
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium flex items-center gap-1.5',
                          isActive(link.to)
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <link.icon className='h-3.5 w-3.5' />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className='flex items-center gap-1.5 shrink-0'>
            {actions}
            <Button
              variant='ghost'
              size='icon'
              asChild
              aria-label='Explore'
              className='h-8 w-8 rounded-full text-muted-foreground hover:text-foreground lg:hidden'
            >
              <Link to='/explore'>
                <Search className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='h-8 w-8 rounded-full text-muted-foreground hover:text-foreground'
            >
              {theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </Button>
            <NotificationDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full p-0'
                >
                  <Avatar className='h-8 w-8 ring-2 ring-primary/20 transition-all hover:ring-primary/40'>
                    <AvatarFallback className='gradient-primary text-primary-foreground font-heading text-[10px] font-semibold'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-52 bg-popover/95 backdrop-blur-xl border-border/30 rounded-xl shadow-lg'
                align='end'
                sideOffset={8}
              >
                <DropdownMenuLabel className='pb-0'>
                  <p className='text-sm font-medium font-heading'>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className='text-[11px] text-muted-foreground mt-0.5'>
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-border/30' />
                {/* Show nav links on mobile/tablet */}
                <div className='lg:hidden'>
                  {dashboardLinks.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link
                        to={link.to}
                        className={cn(
                          'flex items-center gap-2',
                          isActive(link.to) && 'text-primary',
                        )}
                      >
                        <link.icon className='h-4 w-4' />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className='bg-border/30' />
                </div>
                <DropdownMenuItem asChild>
                  <Link to='/profile' className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings' className='flex items-center gap-2'>
                    <Settings className='h-4 w-4' />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-border/30' />
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={handleLogout}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
