import { motion } from 'framer-motion';

interface StatCounterProps {
  value: string;
  label: string;
  index: number;
}

export function StatCounter({ value, label, index }: StatCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='text-center py-6'
    >
      <div className='text-3xl sm:text-4xl font-heading font-bold text-gradient-primary mb-1'>
        {value}
      </div>
      <div className='text-sm text-muted-foreground font-medium'>{label}</div>
    </motion.div>
  );
}
