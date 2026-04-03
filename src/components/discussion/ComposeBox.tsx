import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Bold, Italic, Code, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, type PostCategory } from './types';

interface ComposeBoxProps {
  onPost: (content: string, category: PostCategory) => void;
}

export function ComposeBox({ onPost }: ComposeBoxProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('tech');

  const insertFormatting = (prefix: string, suffix: string) => {
    const textarea = document.querySelector<HTMLTextAreaElement>(
      '[data-compose-textarea]',
    );
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      prefix +
      selected +
      suffix +
      content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content, category);
    setContent('');
  };

  return (
    <Card className='glass border-border/50 shadow-card'>
      <CardContent className='p-5'>
        <div className='flex gap-3'>
          <Avatar className='h-10 w-10 ring-2 ring-primary/10 shrink-0'>
            <AvatarFallback className='bg-primary/10 text-primary font-heading text-sm'>
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-3'>
            <Textarea
              data-compose-textarea
              placeholder='Share your thoughts, ideas, or questions… Use **bold**, *italic*, or `code`'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-1'
            />
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <div className='flex items-center gap-1'>
                {/* Formatting toolbar */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground'
                  onClick={() => insertFormatting('**', '**')}
                  title='Bold'
                >
                  <Bold className='h-3.5 w-3.5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground'
                  onClick={() => insertFormatting('*', '*')}
                  title='Italic'
                >
                  <Italic className='h-3.5 w-3.5' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground'
                  onClick={() => insertFormatting('`', '`')}
                  title='Code'
                >
                  <Code className='h-3.5 w-3.5' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-8'
                >
                  <ImageIcon className='h-3.5 w-3.5 mr-1' /> Media
                </Button>
                <div className='h-4 w-px bg-border mx-1' />
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as PostCategory)}
                >
                  <SelectTrigger className='h-8 w-[130px] text-xs border-border/50'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className='text-xs'
                      >
                        {c.emoji} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size='sm'
                className='gradient-primary border-0 shadow-glow font-medium'
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                <Send className='h-4 w-4 mr-1' /> Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
