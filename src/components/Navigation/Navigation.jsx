
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '#features', label: 'Features' },
    { to: '#community', label: 'Community' },
    { to: '#about', label: 'About' },
  ];

  return (
    <nav className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-sm'>
                  DC
                </span>
              </div>
              <span className='font-bold text-xl'>Dev-Collab</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <Button variant='ghost' asChild>
              <Link to='/signin'>Sign In</Link>
            </Button>
            <Button asChild>
              <Link to='/signup'>Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                <div className='flex flex-col space-y-4 mt-8'>
                  {/* Mobile Logo */}
                  <div className='flex items-center space-x-2 mb-8'>
                    <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                      <span className='text-primary-foreground font-bold text-sm'>
                        DC
                      </span>
                    </div>
                    <span className='font-bold text-xl'>Dev-Collab</span>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className='flex flex-col space-y-4'>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className='text-lg text-muted-foreground hover:text-foreground transition-colors'
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className='flex flex-col space-y-4 pt-8 border-t border-border'>
                    <Button variant='ghost' asChild className='justify-start'>
                      <Link to='/signin' onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className='justify-start'>
                      <Link to='/signup' onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
