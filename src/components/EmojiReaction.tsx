import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SmilePlus } from 'lucide-react';

const emojis = ['👍', '❤️', '🎉', '🚀', '😂', '🔥', '👏', '💯'];

interface EmojiReactionProps {
  reactions: { emoji: string; userId: string }[];
  onReact: (emoji: string) => void;
  currentUserId: string;
}

export function EmojiReaction({
  reactions,
  onReact,
  currentUserId,
}: EmojiReactionProps) {
  const [open, setOpen] = useState(false);

  // Group reactions by emoji
  const grouped = reactions.reduce<Record<string, string[]>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r.userId);
    return acc;
  }, {});

  return (
    <div className='flex items-center gap-1 mt-1'>
      {Object.entries(grouped).map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors ${
            users.includes(currentUserId)
              ? 'border-primary/50 bg-primary/10'
              : 'border-border/50 hover:border-primary/30'
          }`}
        >
          {emoji} {users.length}
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className='h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <SmilePlus className='h-3 w-3 text-muted-foreground' />
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-2 glass' side='top'>
          <div className='flex gap-1'>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(emoji);
                  setOpen(false);
                }}
                className='text-lg hover:scale-125 transition-transform p-1'
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
