import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AppGithubIcon } from '@/components/Icons';


export default function SignInPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const errors: Record<string, string> = {};
    if (!formData.emailOrUsername.trim())
      errors.emailOrUsername = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsPending(true);
    try {
      await signIn(formData.emailOrUsername, formData.password);
      toast.success('Welcome back! You have been signed in successfully.');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setGlobalError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='min-h-screen bg-background grid-pattern flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='mb-8'>
          <Link
            to='/'
            className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors font-medium'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Dev-Collab
          </Link>
        </div>

        <Card className='glass border-border/50 shadow-card'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-center mb-4'>
              <div className='h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow'>
                <span className='text-primary-foreground font-bold text-lg font-heading'>
                  DC
                </span>
              </div>
            </div>
            <CardTitle className='text-2xl text-center font-heading'>
              Welcome back
            </CardTitle>
            <CardDescription className='text-center'>
              Sign in to your Dev-Collab account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Social logins (UI only) */}
            <div className='grid grid-cols-2 gap-3'>
              <Button
                variant='outline'
                className='w-full'
                disabled={isPending}
                onClick={() => setGlobalError('GitHub login coming soon!')}
              >
                <AppGithubIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                disabled={isPending}
                onClick={() => setGlobalError('Google login coming soon!')}
              >
                <Mail className='mr-2 h-4 w-4' />
                Google
              </Button>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-card px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive'
              >
                <AlertCircle className='h-4 w-4 shrink-0' />
                {globalError}
              </motion.div>
            )}

            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <Label htmlFor='emailOrUsername'>Email</Label>
                <Input
                  id='emailOrUsername'
                  name='emailOrUsername'
                  type='text'
                  placeholder='alex@devcollab.io'
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
                {formErrors.emailOrUsername && (
                  <p className='text-xs text-destructive'>
                    {formErrors.emailOrUsername}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                  <button
                    type='button'
                    className='text-sm text-primary hover:underline'
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='password123'
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
                {formErrors.password && (
                  <p className='text-xs text-destructive'>
                    {formErrors.password}
                  </p>
                )}
              </div>
              <Button
                type='submit'
                className='w-full gradient-primary border-0 shadow-glow font-medium'
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo hint */}
            <div className='text-center p-3 rounded-lg bg-muted/50 border border-border/50'>
              <p className='text-xs text-muted-foreground'>
                <span className='font-medium text-foreground'>
                  Demo credentials:
                </span>{' '}
                alex@devcollab.io / password123
              </p>
            </div>

            <Separator />
            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Don't have an account?{' '}
              </span>
              <Link
                to='/signup'
                className='text-primary hover:underline font-medium'
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className='mt-8 text-center'>
          <p className='text-xs text-muted-foreground'>
            Protected by enterprise-grade security. Your data is encrypted and
            secure.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
