
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
import { ArrowLeft, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignInPage() {
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

            {/* Sign In Form */}
            <form className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email or username</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com or johndoe'
                  className='bg-input border-border'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    to='/forgot-password'
                    className='text-sm text-primary hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  className='bg-input border-border'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <Label
                  htmlFor='remember'
                  className='text-sm font-normal cursor-pointer'
                >
                  Remember me for 30 days
                </Label>
              </div>

              <Button type='submit' className='w-full'>
                Sign In
              </Button>
            </form>

            <Separator />

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Don't have an account?{' '}
              </span>
              <Link to='/signup' className='text-primary hover:underline'>
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
