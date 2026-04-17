import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Users, BookOpen, Zap, Globe, Shield, ArrowRight } from 'lucide-react';
import { AppGithubIcon } from '@/components/Icons';
import { StatCounter } from '@/components/StatCounter';
import { FeatureCard } from '@/components/FeatureCard';
import { useAppSelector } from '@/store/hooks';

const features = [
  {
    title: 'Developer Discovery',
    description: 'Find the perfect collaborators based on skills, location, and project interests using our advanced matching algorithm.',
    icon: Users,
  },
  {
    title: 'Project Collaboration',
    description: 'Manage open roles, review applications, and coordinate with your team all in one unified workspace.',
    icon: Terminal,
  },
  {
    title: 'Knowledge Sharing',
    description: 'Join focused discussions, share your expertise, and learn from a global community of experienced developers.',
    icon: BookOpen,
  },
  {
    title: 'Rapid Prototyping',
    description: 'Go from idea to prototype faster by teaming up with complementary skill sets in real-time.',
    icon: Zap,
  },
  {
    title: 'Global Community',
    description: 'Connect with developers from over 50 countries. Break down geographical barriers in software development.',
    icon: Globe,
  },
  {
    title: 'Secure & Private',
    description: 'Control your visibility, manage connection requests, and communicate securely with end-to-end encrypted chats.',
    icon: Shield,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar Minimal for Home */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs shadow-glow">
              DC
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">Dev-Collab</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground hidden sm:block">Explore</Link>
            <Link to="/discussion" className="text-muted-foreground hover:text-foreground hidden sm:block">Discussions</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2 px-4 shadow-sm">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" className="text-foreground hover:text-primary transition-colors">Sign In</Link>
                <Link to="/signup" className="btn-primary py-2 px-4 shadow-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 grid-pattern">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now in public beta
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-8"
          >
            Build software <br className="hidden sm:block" />
            <span className="text-gradient-primary">together, faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The premium platform for developers to discover projects, collaborate with peers, and build the next generation of software right here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={handleCTA} className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4 w-full sm:w-auto">
              <AppGithubIcon className="h-4 w-4" />
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-muted/20 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/50">
          <StatCounter value="10K+" label="Developers" index={0} />
          <StatCounter value="500+" label="Projects" index={1} />
          <StatCounter value="50+" label="Countries" index={2} />
          <StatCounter value="24/7" label="Support" index={3} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-6">Everything you need to ship</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've built a comprehensive suite of tools designed specifically for modern developer collaboration workflows.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={feature.title} {...feature} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-6">Ready to join the network?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create your profile in 2 minutes and start connecting with thousands of developers building amazing things.
          </p>
          <button onClick={handleCTA} className="btn-primary text-base px-8 py-4 shadow-glow hover:scale-105 active:scale-95 transition-transform">
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-12 px-6 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs">
              DC
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">Dev-Collab</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Documentation</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Support</Link>
          </div>
          
          <p className="text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} Dev-Collab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
