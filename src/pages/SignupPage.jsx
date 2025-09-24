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
import { ArrowLeft, Github, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '@/hooks/useAuth/useSignup';
import { useAppStore } from '@/store';
 // Adjust import path as needed

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { mutate: signup, isPending, error } = useSignup();

  const setUserProfile = useAppStore((state) => state.setUserProfile);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.emailId.trim()) {
      errors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      errors.emailId = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create payload matching your API structure
    const signupPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      emailId: formData.emailId.trim(),
      password: formData.password,
    };

    signup(signupPayload, {
      onSuccess: (data) => {
        // Handle successful signup
        console.log('Signup successful:', data);

        setUserProfile(data?.user); // Assuming the API returns user profile data

        // Redirect to dashboard or desired page
        navigate('/dashboard'); // Adjust route as needed

        // You can also show a success message here
        // toast.success('Account created successfully!');
      },
      onError: (error) => {
        // Error is already handled in the hook, but you can add UI feedback here
        console.error('Signup error in component:', error);

        // You can show a toast notification here
        // toast.error(error.message || 'Failed to create account');
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
            <CardTitle className='text-2xl text-center'>
              Join Dev-Collab
            </CardTitle>
            <CardDescription className='text-center'>
              Connect with developers worldwide and start collaborating on
              amazing projects
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Social Sign Up */}
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
                    {error.message ||
                      'Failed to create account. Please try again.'}
                  </span>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First name</Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    placeholder='John'
                    className='bg-input border-border'
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
                    className='bg-input border-border'
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
                  className='bg-input border-border'
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

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm password</Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  className='bg-input border-border'
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

              <Button type='submit' className='w-full' disabled={isPending}>
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
              <Link to='#' className='underline hover:text-foreground'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='#' className='underline hover:text-foreground'>
                Privacy Policy
              </Link>
            </div>

            <Separator />

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Already have an account?{' '}
              </span>
              <Link to='/signin' className='text-primary hover:underline'>
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-muted-foreground mb-4'>
            Join thousands of developers who are already collaborating
          </p>
          <div className='flex justify-center space-x-8 text-xs text-muted-foreground'>
            <div>
              <div className='font-semibold text-foreground'>10K+</div>
              <div>Developers</div>
            </div>
            <div>
              <div className='font-semibold text-foreground'>500+</div>
              <div>Projects</div>
            </div>
            <div>
              <div className='font-semibold text-foreground'>50+</div>
              <div>Countries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
