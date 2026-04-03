import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, Sun, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '#features', label: 'Features' },
  { to: '#community', label: 'Community' },
  { to: '/projects', label: 'Projects' },
  { to: '/discussion', label: 'Discussion' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (to: string) => location.pathname === to;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className='fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2.5 group relative'>
            <div className='h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_hsla(185,72%,48%,0.3)]'>
              <span className='text-primary-foreground font-bold text-xs font-heading tracking-tight'>
                DC
              </span>
            </div>
            <span className='font-heading font-semibold text-base tracking-tight'>
              Dev-Collab
            </span>
          </Link>

          {/* Desktop Links */}
          <div className='hidden md:flex items-center'>
            <div className='flex items-center bg-muted/50 rounded-full px-1 py-1 gap-0.5'>
              {navLinks.map((link) => {
                const active = !link.to.startsWith('#') && isActive(link.to);
                const baseClasses = cn(
                  'text-sm px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium',
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                );
                return link.to.startsWith('#') ? (
                  <a key={link.to} href={link.to} className={baseClasses}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className={baseClasses}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center gap-2'>
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
            {isAuthenticated ? (
              <Button
                size='sm'
                asChild
                className='gradient-primary border-0 font-medium shadow-glow h-8 rounded-full px-4 text-xs'
              >
                <Link to='/dashboard'>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  asChild
                  className='font-medium h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground'
                >
                  <Link to='/signin'>Sign In</Link>
                </Button>
                <Button
                  size='sm'
                  asChild
                  className='gradient-primary border-0 font-medium shadow-glow h-8 rounded-full px-4 text-xs group'
                >
                  <Link to='/signup'>
                    Get Started
                    <ArrowRight className='h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5' />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className='md:hidden flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='h-8 w-8 rounded-full'
            >
              {theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full'
                >
                  <Menu className='h-4 w-4' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-[280px] bg-background/95 backdrop-blur-2xl border-border/30 p-0'
              >
                <div className='flex flex-col h-full'>
                  <div className='flex items-center gap-2.5 p-5 border-b border-border/30'>
                    <div className='h-8 w-8 rounded-lg gradient-primary flex items-center justify-center'>
                      <span className='text-primary-foreground font-bold text-xs font-heading'>
                        DC
                      </span>
                    </div>
                    <span className='font-heading font-semibold text-base'>
                      Dev-Collab
                    </span>
                  </div>
                  <div className='flex flex-col p-3 gap-0.5 flex-1'>
                    {navLinks.map((link) => {
                      const active =
                        !link.to.startsWith('#') && isActive(link.to);
                      const baseClasses = cn(
                        'text-sm py-2.5 px-3 rounded-lg transition-all font-medium',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      );
                      return link.to.startsWith('#') ? (
                        <a
                          key={link.to}
                          href={link.to}
                          className={baseClasses}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={baseClasses}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className='flex flex-col gap-2 p-4 border-t border-border/30'>
                    {isAuthenticated ? (
                      <Button
                        asChild
                        className='gradient-primary border-0 rounded-full h-9'
                      >
                        <Link to='/dashboard' onClick={() => setIsOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant='outline'
                          asChild
                          className='rounded-full h-9 border-border/50'
                        >
                          <Link to='/signin' onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className='gradient-primary border-0 rounded-full h-9'
                        >
                          <Link to='/signup' onClick={() => setIsOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
