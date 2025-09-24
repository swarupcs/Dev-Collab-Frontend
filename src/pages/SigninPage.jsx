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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Github, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignin } from '@/hooks/useAuth/useSignin';
import { useAppStore } from '@/store';

; // Adjust import path as needed

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { mutate: signin, isPending, error } = useSignin();

  const setUserProfile = useAppStore((state)=> state.setUserProfile);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.emailOrUsername.trim()) {
      errors.emailOrUsername = 'Email or username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create payload for signin
    const signinPayload = {
      emailId: formData.emailOrUsername.trim(),
      password: formData.password,
    };

    signin(signinPayload, {
      onSuccess: (data) => {
        // Handle successful signin
        // console.log('Signin successful:', data);
        // console.log("data",data)
        setUserProfile(data?.data?.user); // Assuming the API returns user profile data

        // Redirect to dashboard or desired page
        navigate('/dashboard'); // Adjust route as needed

        // You can also show a success message here
        // toast.success('Welcome back!');
      },
      onError: (error) => {
        // Error is already handled in the hook, but you can add UI feedback here
        console.error('Signin error in component:', error);

        // You can show a toast notification here
        // toast.error(error.message || 'Failed to sign in');
      },
    });
  };

  return (
    <div className='min-h-screen bg-background grid-pattern flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Back to home link */}
        <div className='mb-8'>
          <Link
            to='/'
            className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Dev-Collab
          </Link>
        </div>

        <Card className='bg-card/50 backdrop-blur border-border/50'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-center mb-4'>
              <div className='h-12 w-12 rounded-lg bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-lg'>
                  DC
                </span>
              </div>
            </div>
            <CardTitle className='text-2xl text-center'>Welcome back</CardTitle>
            <CardDescription className='text-center'>
              Sign in to your Dev-Collab account to continue collaborating
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Social Sign In */}
            <div className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                className='w-full bg-transparent'
                disabled={isPending}
              >
                <Github className='mr-2 h-4 w-4' />
                GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full bg-transparent'
                disabled={isPending}
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

            {/* Error Display */}
            {error && (
              <div className='bg-destructive/10 border border-destructive/20 rounded-md p-3'>
                <div className='flex items-center'>
                  <AlertCircle className='h-4 w-4 text-destructive mr-2' />
                  <span className='text-sm text-destructive'>
                    {error.message || 'Invalid credentials. Please try again.'}
                  </span>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <Label htmlFor='emailOrUsername'>Email or username</Label>
                <Input
                  id='emailOrUsername'
                  name='emailOrUsername'
                  type='text'
                  placeholder='john@example.com or johndoe'
                  className='bg-input border-border'
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
                  <Link
                    to='/forgot-password'
                    className='text-sm text-primary hover:underline'
                    tabIndex={isPending ? -1 : 0}
                    onClick={isPending ? (e) => e.preventDefault() : undefined}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  className='bg-input border-border'
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


              <Button type='submit' className='w-full' disabled={isPending}>
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

            <Separator />

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Don't have an account?{' '}
              </span>
              <Link
                to='/signup'
                className={`text-primary hover:underline ${
                  isPending ? 'pointer-events-none opacity-50' : ''
                }`}
                tabIndex={isPending ? -1 : 0}
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-muted-foreground'>
            Protected by enterprise-grade security. Your data is encrypted and
            secure.
          </p>
        </div>
      </div>
    </div>
  );
}
