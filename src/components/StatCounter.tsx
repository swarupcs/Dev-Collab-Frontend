import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface StatCounterProps {
  value: string;
  label: string;
  index: number;
}

export function StatCounter({ value, label, index }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    // Extract number from value (e.g., "10K+" -> 10, "500+" -> 500)
    const numericPart = parseInt(value) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    
    const controls = animate(0, numericPart, {
      duration: 2,
      delay: index * 0.2,
      ease: "easeOut",
      onUpdate(value) {
        setDisplayValue(Math.floor(value).toString() + suffix);
      }
    });

    return () => controls.stop();
  }, [value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='text-center py-10'
    >
      <div className='text-4xl sm:text-5xl font-heading font-bold text-gradient-primary mb-2'>
        {displayValue}
      </div>
      <div className='text-sm text-muted-foreground font-semibold uppercase tracking-widest'>{label}</div>
    </motion.div>
  );
}
