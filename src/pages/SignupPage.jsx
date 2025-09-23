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
import { ArrowLeft, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
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
              <Button variant='outline' className='w-full bg-transparent'>
                <Github className='mr-2 h-4 w-4' />
                GitHub
              </Button>
              <Button variant='outline' className='w-full bg-transparent'>
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

            {/* Sign Up Form */}
            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First name</Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    className='bg-input border-border'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last name</Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    className='bg-input border-border'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  className='bg-input border-border'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  placeholder='johndoe'
                  className='bg-input border-border'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  className='bg-input border-border'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  className='bg-input border-border'
                />
              </div>

              <Button type='submit' className='w-full'>
                Create Account
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
