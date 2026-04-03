import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';


interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className='group relative p-6 rounded-2xl glass border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300'
    >
      <div className='absolute inset-0 rounded-2xl gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      <div className='relative'>
        <div className='h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:animate-pulse-glow transition-all'>
          <Icon className='h-6 w-6 text-primary-foreground' />
        </div>
        <h3 className='font-heading font-semibold text-lg mb-2'>{title}</h3>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
