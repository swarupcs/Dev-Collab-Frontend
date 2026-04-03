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
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AppGithubIcon } from '@/components/Icons';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
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
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.emailId.trim()) errors.emailId = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId))
      errors.emailId = 'Invalid email';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsPending(true);
    try {
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.emailId,
        password: formData.password,
      });
      toast.success('Welcome to Dev-Collab!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setGlobalError(err.message || 'Sign up failed.');
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
              Join Dev-Collab
            </CardTitle>
            <CardDescription className='text-center'>
              Connect with developers worldwide and start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <Button
                variant='outline'
                className='w-full'
                disabled={isPending}
                onClick={() => setGlobalError('GitHub signup coming soon!')}
              >
                <AppGithubIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                disabled={isPending}
                onClick={() => setGlobalError('Google signup coming soon!')}
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
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First name</Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isPending}
                  />
                  {formErrors.firstName && (
                    <p className='text-xs text-destructive'>
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last name</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isPending}
                  />
                  {formErrors.lastName && (
                    <p className='text-xs text-destructive'>
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='emailId'>Email</Label>
                <Input
                  id='emailId'
                  name='emailId'
                  type='email'
                  placeholder='john@example.com'
                  value={formData.emailId}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
                {formErrors.emailId && (
                  <p className='text-xs text-destructive'>
                    {formErrors.emailId}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
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
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm password</Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
                {formErrors.confirmPassword && (
                  <p className='text-xs text-destructive'>
                    {formErrors.confirmPassword}
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className='text-center text-sm text-muted-foreground'>
              By creating an account, you agree to our{' '}
              <a href='#' className='underline hover:text-foreground'>
                Terms
              </a>{' '}
              and{' '}
              <a href='#' className='underline hover:text-foreground'>
                Privacy Policy
              </a>
            </div>
            <Separator />
            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Already have an account?{' '}
              </span>
              <Link
                to='/signin'
                className='text-primary hover:underline font-medium'
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className='mt-8 text-center'>
          <p className='text-sm text-muted-foreground mb-4'>
            Join thousands of developers already collaborating
          </p>
          <div className='flex justify-center gap-8 text-xs text-muted-foreground'>
            <div>
              <div className='font-heading font-semibold text-foreground text-base'>
                10K+
              </div>
              Developers
            </div>
            <div>
              <div className='font-heading font-semibold text-foreground text-base'>
                500+
              </div>
              Projects
            </div>
            <div>
              <div className='font-heading font-semibold text-foreground text-base'>
                50+
              </div>
              Countries
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
