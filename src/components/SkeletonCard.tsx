import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card className='glass border-border/50 shadow-card'>
      <CardHeader className='space-y-2'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent className='space-y-3'>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-4 w-full'
            style={{ width: `${85 - i * 10}%` }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function SkeletonProfile() {
  return (
    <Card className='glass border-border/50 shadow-card overflow-hidden'>
      <Skeleton className='h-36 w-full rounded-none' />
      <CardContent className='pt-0 pb-6 px-6'>
        <Skeleton className='h-28 w-28 rounded-full -mt-16 mb-4' />
        <Skeleton className='h-7 w-48 mb-2' />
        <Skeleton className='h-4 w-32 mb-4' />
        <div className='flex gap-4'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='flex items-center gap-3 p-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-1/3' />
            <Skeleton className='h-3 w-2/3' />
          </div>
        </div>
      ))}
    </div>
  );
}
