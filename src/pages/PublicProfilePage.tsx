import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Globe,
  Calendar,
  Code,
  Users,
  MessageCircle,
  UserPlus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageTransition } from '@/components/PageTransition';
import { SkeletonProfile } from '@/components/SkeletonCard';
import { usersApi } from '@/services/mockApi';
import { type MockUser } from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';
import { AppGithubIcon } from '@/components/Icons';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    usersApi
      .getById(id || '')
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className='min-h-screen bg-background grid-pattern'>
      <DashboardHeader
        backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}
      />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl'>
          {loading ? (
            <SkeletonProfile />
          ) : !profile ? (
            <Card className='glass border-border/50 shadow-card'>
              <CardContent className='py-16 text-center'>
                <p className='text-muted-foreground'>User not found.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className='glass border-border/50 shadow-card overflow-hidden'>
                  <div className='h-36 gradient-hero relative'>
                    <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(185,72%,40%,0.2),_transparent_60%)]' />
                  </div>
                  <CardContent className='relative pt-0 pb-6 px-6'>
                    <div className='flex items-end justify-between -mt-16 mb-4'>
                      <div className='relative'>
                        <Avatar className='h-28 w-28 ring-4 ring-card shadow-card'>
                          <AvatarFallback className='gradient-primary text-primary-foreground text-3xl font-heading font-bold'>
                            {profile.firstName[0]}
                            {profile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {profile.isOnline && (
                          <div className='absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-card bg-green-500' />
                        )}
                      </div>
                      {!isOwnProfile && (
                        <Button
                          className='gradient-primary border-0 shadow-glow font-medium'
                          onClick={() =>
                            toast.success('Connection request sent!')
                          }
                        >
                          <UserPlus className='h-4 w-4 mr-1' />
                          Connect
                        </Button>
                      )}
                    </div>
                    <h1 className='text-2xl font-heading font-bold mb-1'>
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className='text-sm text-muted-foreground mb-3'>
                      {profile.email}
                    </p>
                    <div className='flex gap-6 text-sm'>
                      {[
                        { icon: Users, value: '24', label: 'Connections' },
                        { icon: Code, value: '5', label: 'Projects' },
                        { icon: MessageCircle, value: '89', label: 'Messages' },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className='flex items-center gap-1.5 text-muted-foreground'
                        >
                          <s.icon className='h-4 w-4' />
                          <span className='font-heading font-semibold text-foreground'>
                            {s.value}
                          </span>
                          <span className='hidden sm:inline'>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className='grid gap-6 lg:grid-cols-3 mt-6'>
                <div className='space-y-6'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm font-heading'>
                        Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {profile.location && (
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <MapPin className='h-4 w-4' />
                          {profile.location}
                        </div>
                      )}
                      {profile.website && (
                        <div className='flex items-center gap-2 text-sm'>
                          <Globe className='h-4 w-4 text-muted-foreground' />
                          <a
                            href={profile.website}
                            className='text-primary hover:underline truncate'
                          >
                            {profile.website.replace('https://', '')}
                          </a>
                        </div>
                      )}
                      {profile.github && (
                        <div className='flex items-center gap-2 text-sm'>
                          <AppGithubIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                          <a
                            href={`https://github.com/${profile.github}`}
                            className='text-primary hover:underline'
                          >
                            {profile.github}
                          </a>
                        </div>
                      )}
                      {profile.twitter && (
                        <div className='flex items-center gap-2 text-sm'>
                          <XTwitterIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                          <a
                            href={`https://twitter.com/${profile.twitter}`}
                            className='text-primary hover:underline'
                          >
                            @{profile.twitter}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardContent className='pt-5 pb-5'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4' />
                        Joined{' '}
                        {new Date(profile.joinedDate).toLocaleDateString(
                          'en-US',
                          { month: 'long', year: 'numeric' },
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className='lg:col-span-2 space-y-6'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm font-heading'>
                        About
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm leading-relaxed text-muted-foreground'>
                        {profile.bio || 'No bio yet.'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm font-heading'>
                        Skills
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        {profile.skills.length} skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-wrap gap-2'>
                        {profile.skills.map((s) => (
                          <Badge
                            key={s}
                            variant='secondary'
                            className='text-sm py-1 px-3'
                          >
                            {s}
                          </Badge>
                        ))}
                        {profile.skills.length === 0 && (
                          <p className='text-sm text-muted-foreground'>
                            No skills listed.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
