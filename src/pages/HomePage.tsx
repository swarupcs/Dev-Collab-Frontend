import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Users,
  Code,
  MessageSquare,
  Zap,
  Globe,
  Shield,
} from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { StatCounter } from '@/components/StatCounter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  {
    icon: Users,
    title: 'Developer Discovery',
    description:
      'Find developers with complementary skills for your next project. Connect based on expertise, location, and interests.',
  },
  {
    icon: Code,
    title: 'Project Collaboration',
    description:
      'Real-time collaboration tools, code sharing, and project management features designed for development teams.',
  },
  {
    icon: MessageSquare,
    title: 'Knowledge Sharing',
    description:
      'Share insights, ask questions, and learn from the community. Build your reputation and help others grow.',
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping',
    description:
      'Quickly iterate on ideas with integrated development tools and seamless deployment workflows.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description:
      'Connect with developers worldwide. Join local meetups, participate in hackathons, and build lasting relationships.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your code and conversations are protected with enterprise-grade security and granular permissions.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Developers' },
  { value: '500+', label: 'Projects Launched' },
  { value: '50+', label: 'Countries' },
  { value: '24/7', label: 'Community Support' },
];

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={heroBg}
            alt=''
            className='w-full h-full object-cover opacity-30'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background' />
        </div>
        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium mb-8'>
                <span className='h-1.5 w-1.5 rounded-full gradient-primary animate-pulse' />
                Now in public beta
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className='text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]'
            >
              The platform to{' '}
              <span className='text-gradient-primary'>connect developers</span>{' '}
              worldwide.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className='text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed'
            >
              Stop working in isolation. Discover, connect, and build amazing
              projects with developers from around the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className='flex flex-col sm:flex-row gap-4 justify-center'
            >
              <Button
                size='lg'
                asChild
                className='gradient-primary border-0 text-lg px-8 h-12 shadow-glow font-heading font-medium'
              >
                <Link to='/signup'>
                  Join the Community
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-lg px-8 h-12 font-heading font-medium'
              >
                <Link to='/dashboard'>Explore Projects</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='border-y border-border/50 bg-muted/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='py-24 grid-pattern'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl sm:text-4xl font-heading font-bold mb-4'>
              Make collaboration{' '}
              <span className='text-gradient-primary'>seamless</span>.
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Tools for your team and community to share knowledge and iterate
              faster.
            </p>
          </motion.div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id='community' className='py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='max-w-3xl mx-auto text-center rounded-3xl gradient-hero p-12 sm:p-16 shadow-glow relative overflow-hidden'
          >
            <div className='absolute inset-0 grid-pattern opacity-30' />
            <div className='relative'>
              <h2 className='text-3xl sm:text-4xl font-heading font-bold mb-6 text-primary-foreground'>
                Faster iteration. More innovation.
              </h2>
              <p className='text-lg text-primary-foreground/70 mb-8 leading-relaxed'>
                Let your team focus on shipping features instead of managing
                infrastructure with automated workflows, built-in testing, and
                integrated collaboration.
              </p>
              <Button
                size='lg'
                asChild
                className='gradient-primary border-0 text-lg px-8 h-12 shadow-glow font-heading font-medium'
              >
                <Link to='/signup'>
                  Start Building Today
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border/50 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-2.5 mb-4 md:mb-0'>
              <div className='h-8 w-8 rounded-xl gradient-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-xs font-heading'>
                  DC
                </span>
              </div>
              <span className='font-heading font-bold text-lg'>Dev-Collab</span>
            </div>
            <div className='flex gap-6 text-sm text-muted-foreground'>
              {['Privacy', 'Terms', 'Support', 'Docs'].map((link) => (
                <a
                  key={link}
                  href='#'
                  className='hover:text-foreground transition-colors'
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground'>
            © 2025 Dev-Collab. Built for developers, by developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
