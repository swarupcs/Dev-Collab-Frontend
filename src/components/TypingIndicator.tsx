import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className='flex items-center gap-1.5 p-3 rounded-2xl bg-muted rounded-bl-md w-fit'>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='h-2 w-2 rounded-full bg-muted-foreground/50'
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
