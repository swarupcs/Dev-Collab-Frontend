
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Users,
  Code,
  MessageSquare,
  Zap,
  Globe,
  Shield,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation/Navigation';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background grid-pattern'>
      <Navigation />

      {/* Hero Section */}
      <section className='relative py-20 lg:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6'>
              The complete platform to{' '}
              <span className='text-primary'>connect developers</span>.
            </h1>
            <p className='text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed'>
              Your team's toolkit to stop working in isolation and start
              collaborating. Discover, connect, and build amazing projects with
              developers worldwide.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' asChild className='text-lg px-8 py-6'>
                <Link to='/signup'>
                  Join the Community
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-lg px-8 py-6 bg-transparent'
              >
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 border-y border-border'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='text-3xl font-bold mb-2'>10K+</div>
              <div className='text-muted-foreground'>Active Developers</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold mb-2'>500+</div>
              <div className='text-muted-foreground'>Projects Launched</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold mb-2'>50+</div>
              <div className='text-muted-foreground'>Countries</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold mb-2'>24/7</div>
              <div className='text-muted-foreground'>Community Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
              Make collaboration seamless.
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Tools for your team and community to share knowledge and iterate
              faster.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <Users className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Developer Discovery</CardTitle>
                <CardDescription>
                  Find developers with complementary skills for your next
                  project. Connect based on expertise, location, and interests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <Code className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Project Collaboration</CardTitle>
                <CardDescription>
                  Real-time collaboration tools, code sharing, and project
                  management features designed specifically for development
                  teams.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <MessageSquare className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Knowledge Sharing</CardTitle>
                <CardDescription>
                  Share insights, ask questions, and learn from the community.
                  Build your reputation and help others grow.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <Zap className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Rapid Prototyping</CardTitle>
                <CardDescription>
                  Quickly iterate on ideas with integrated development tools and
                  seamless deployment workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <Globe className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Global Community</CardTitle>
                <CardDescription>
                  Connect with developers worldwide. Join local meetups,
                  participate in hackathons, and build lasting relationships.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='bg-card/50 backdrop-blur border-border/50'>
              <CardHeader>
                <Shield className='h-12 w-12 text-primary mb-4' />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your code and conversations are protected with
                  enterprise-grade security. Control who sees what with granular
                  permissions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id='community' className='py-20 bg-card/20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
              Faster iteration. More innovation.
            </h2>
            <p className='text-xl text-muted-foreground mb-8 leading-relaxed'>
              The platform for rapid progress. Let your team focus on shipping
              features instead of managing infrastructure with automated
              workflows, built-in testing, and integrated collaboration.
            </p>
            <Button size='lg' asChild className='text-lg px-8 py-6'>
              <Link to='/signup'>
                Start Building Today
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-sm'>
                  DC
                </span>
              </div>
              <span className='font-bold text-xl'>Dev-Collab</span>
            </div>
            <div className='flex space-x-6 text-sm text-muted-foreground'>
              <Link
                to='#'
                className='hover:text-foreground transition-colors'
              >
                Privacy
              </Link>
              <Link
                to='#'
                className='hover:text-foreground transition-colors'
              >
                Terms
              </Link>
              <Link
                to='#'
                className='hover:text-foreground transition-colors'
              >
                Support
              </Link>
              <Link
                to='#'
                className='hover:text-foreground transition-colors'
              >
                Docs
              </Link>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground'>
            © 2025 Dev-Collab. Built for developers, by developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
