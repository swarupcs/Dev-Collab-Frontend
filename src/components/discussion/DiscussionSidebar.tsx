import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Bookmark } from 'lucide-react';
import {  CATEGORIES, type PostCategory } from './types';

const trendingTopics = [
  '#React19',
  '#RustLang',
  '#AIAgents',
  '#OpenSource',
  '#DevOps',
  '#TypeScript',
];

interface DiscussionSidebarProps {
  selectedCategory: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
  bookmarkCount: number;
  showBookmarks: boolean;
  onToggleBookmarks: () => void;
}

export function DiscussionSidebar({
  selectedCategory,
  onCategoryChange,
  bookmarkCount,
  showBookmarks,
  onToggleBookmarks,
}: DiscussionSidebarProps) {
  return (
    <aside className='space-y-6 hidden lg:block'>
      {/* Bookmarks */}
      <Card className='glass border-border/50 shadow-card'>
        <CardContent className='p-5'>
          <Button
            variant={showBookmarks ? 'default' : 'outline'}
            className='w-full justify-start gap-2'
            onClick={onToggleBookmarks}
          >
            <Bookmark
              className={`h-4 w-4 ${showBookmarks ? 'fill-primary-foreground' : ''}`}
            />
            Saved Posts
            {bookmarkCount > 0 && (
              <Badge variant='secondary' className='ml-auto text-xs'>
                {bookmarkCount}
              </Badge>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className='glass border-border/50 shadow-card'>
        <CardContent className='p-5'>
          <h3 className='font-heading font-semibold text-sm mb-3'>
            Categories
          </h3>
          <div className='space-y-1'>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === cat.value && !showBookmarks
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending */}
      <Card className='glass border-border/50 shadow-card'>
        <CardContent className='p-5'>
          <h3 className='font-heading font-semibold text-sm mb-3 flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-primary' /> Trending
          </h3>
          <div className='flex flex-wrap gap-2'>
            {trendingTopics.map((topic) => (
              <Badge
                key={topic}
                variant='secondary'
                className='cursor-pointer hover:bg-primary/10 transition-colors'
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className='glass border-border/50 shadow-card'>
        <CardContent className='p-5'>
          <h3 className='font-heading font-semibold text-sm mb-3'>
            Community Guidelines
          </h3>
          <ul className='space-y-2 text-xs text-muted-foreground'>
            <li>✦ Be respectful and constructive</li>
            <li>✦ Share knowledge freely</li>
            <li>✦ No spam or self-promotion</li>
            <li>✦ Give credit when sharing others' work</li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
