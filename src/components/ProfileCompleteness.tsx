import { Progress } from '@/components/ui/progress';
import type { MockUser } from '@/services/mockData';

export function ProfileCompleteness({ user }: { user: MockUser }) {
  const fields = [
    !!user.bio,
    !!user.location,
    !!user.website,
    !!user.github,
    !!user.twitter,
    user.skills.length > 0,
    !!user.avatarUrl,
  ];
  const completed = fields.filter(Boolean).length;
  const percentage = Math.round((completed / fields.length) * 100);

  if (percentage === 100) return null;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm'>
        <span className='text-muted-foreground'>Profile completeness</span>
        <span className='font-heading font-semibold text-primary'>
          {percentage}%
        </span>
      </div>
      <Progress value={percentage} className='h-2' />
      <p className='text-xs text-muted-foreground'>
        {percentage < 50
          ? 'Add more details to stand out to other developers.'
          : percentage < 100
            ? 'Almost there! Complete your profile for better discoverability.'
            : ''}
      </p>
    </div>
  );
}
