import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='flex flex-col items-center justify-center py-16 px-4 text-center'
    >
      <div className='h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4'>
        <Icon className='h-8 w-8 text-muted-foreground/40' />
      </div>
      <h3 className='font-heading font-semibold text-lg mb-1'>{title}</h3>
      <p className='text-sm text-muted-foreground max-w-sm mb-6'>
        {description}
      </p>
      {action}
    </motion.div>
  );
}
