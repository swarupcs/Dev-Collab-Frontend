import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Plus,
  X,
  Save,
  Pencil,
  MapPin,
  Globe,
  Calendar,
  Code,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { PageTransition } from '@/components/PageTransition';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user!);
  const [newSkill, setNewSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!user) return null;

  const handleEdit = () => {
    setEditData({ ...user });
    setIsEditing(true);
  };
  const handleSave = () => {
    updateUser({ ...editData, avatarUrl: avatarPreview || editData.avatarUrl });
    setIsEditing(false);
    toast.success('Profile updated');
  };
  const handleCancel = () => {
    setEditData({ ...user });
    setAvatarPreview(null);
    setIsEditing(false);
  };
  const handleChange = (field: string, value: string) =>
    setEditData((p) => ({ ...p, [field]: value }));

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !editData.skills.includes(s)) {
      setEditData((p) => ({ ...p, skills: [...p.skills, s] }));
      setNewSkill('');
    }
  };
  const removeSkill = (s: string) =>
    setEditData((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const data = isEditing ? editData : user;

  return (
    <div className='min-h-screen bg-background grid-pattern'>
      <DashboardHeader
        backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}
        actions={
          isEditing ? (
            <>
              <Button variant='ghost' size='sm' onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size='sm'
                className='gradient-primary border-0 shadow-glow font-medium'
                onClick={handleSave}
              >
                <Save className='h-4 w-4 mr-1' />
                Save
              </Button>
            </>
          ) : (
            <Button size='sm' variant='outline' onClick={handleEdit}>
              <Pencil className='h-4 w-4 mr-1' />
              Edit Profile
            </Button>
          )
        }
      />

      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl'>
          {/* Profile Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className='glass border-border/50 shadow-card overflow-hidden'>
              <div className='h-36 gradient-hero relative'>
                <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(185,72%,40%,0.2),_transparent_60%)]' />
              </div>
              <CardContent className='relative pt-0 pb-6 px-6'>
                <div className='relative -mt-16 mb-4 w-fit'>
                  <Avatar className='h-28 w-28 ring-4 ring-card shadow-card'>
                    <AvatarImage src={avatarPreview || data.avatarUrl} />
                    <AvatarFallback className='gradient-primary text-primary-foreground text-3xl font-heading font-bold'>
                      {data.firstName[0]}
                      {data.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className='absolute bottom-1 right-1 h-8 w-8 rounded-full gradient-primary flex items-center justify-center shadow-glow border-2 border-card cursor-pointer'>
                      <Camera className='h-4 w-4 text-primary-foreground' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                {isEditing ? (
                  <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs'>First name</Label>
                      <Input
                        value={editData.firstName}
                        onChange={(e) =>
                          handleChange('firstName', e.target.value)
                        }
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs'>Last name</Label>
                      <Input
                        value={editData.lastName}
                        onChange={(e) =>
                          handleChange('lastName', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <h1 className='text-2xl font-heading font-bold mb-1'>
                    {data.firstName} {data.lastName}
                  </h1>
                )}
                <p className='text-sm text-muted-foreground mb-3'>
                  {data.email}
                </p>
                <div className='flex gap-6 text-sm'>
                  {[
                    { icon: Users, label: 'Connections', value: '4' },
                    { icon: Code, label: 'Projects', value: '3' },
                    { icon: MessageCircle, label: 'Messages', value: '128' },
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
            {/* Left column */}
            <div className='space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className='glass border-border/50 shadow-card'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-heading'>
                      Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    {isEditing ? (
                      <>
                        <div className='space-y-1.5'>
                          <Label className='text-xs'>Location</Label>
                          <Input
                            value={editData.location}
                            onChange={(e) =>
                              handleChange('location', e.target.value)
                            }
                            placeholder='City, Country'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label className='text-xs'>Website</Label>
                          <Input
                            value={editData.website}
                            onChange={(e) =>
                              handleChange('website', e.target.value)
                            }
                            placeholder='https://'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label className='text-xs'>GitHub</Label>
                          <Input
                            value={editData.github}
                            onChange={(e) =>
                              handleChange('github', e.target.value)
                            }
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label className='text-xs'>Twitter</Label>
                          <Input
                            value={editData.twitter}
                            onChange={(e) =>
                              handleChange('twitter', e.target.value)
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {data.location && (
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <MapPin className='h-4 w-4 shrink-0' />
                            {data.location}
                          </div>
                        )}
                        {data.website && (
                          <div className='flex items-center gap-2 text-sm'>
                            <Globe className='h-4 w-4 shrink-0 text-muted-foreground' />
                            <a
                              href={data.website}
                              className='text-primary hover:underline truncate'
                            >
                              {data.website.replace('https://', '')}
                            </a>
                          </div>
                        )}
                        {data.github && (
                          <div className='flex items-center gap-2 text-sm'>
                            <GithubIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
                            <a
                              href={`https://github.com/${data.github}`}
                              className='text-primary hover:underline'
                            >
                              {data.github}
                            </a>
                          </div>
                        )}
                        {data.twitter && (
                          <div className='flex items-center gap-2 text-sm'>
                            <Twitter className='h-4 w-4 shrink-0 text-muted-foreground' />
                            <a
                              href={`https://twitter.com/${data.twitter}`}
                              className='text-primary hover:underline'
                            >
                              @{data.twitter}
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className='glass border-border/50 shadow-card'>
                  <CardContent className='pt-5 pb-5 space-y-4'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      Joined{' '}
                      {new Date(data.joinedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <ProfileCompleteness user={data} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right column */}
            <div className='lg:col-span-2 space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className='glass border-border/50 shadow-card'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-heading'>
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder='Tell others about yourself...'
                        className='min-h-[120px] resize-none'
                        maxLength={500}
                      />
                    ) : (
                      <p className='text-sm leading-relaxed text-muted-foreground'>
                        {data.bio || 'No bio yet.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className='glass border-border/50 shadow-card'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-heading'>
                      Skills
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      {isEditing
                        ? 'Add or remove your technical skills'
                        : `${data.skills.length} skills`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing && (
                      <div className='flex gap-2 mb-4'>
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder='Add a skill...'
                          className='flex-1'
                          onKeyDown={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), addSkill())
                          }
                        />
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={addSkill}
                          disabled={!newSkill.trim()}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                    <div className='flex flex-wrap gap-2'>
                      {data.skills.map((s) => (
                        <Badge
                          key={s}
                          variant='secondary'
                          className={`text-sm py-1 px-3 ${isEditing ? 'pr-1.5' : ''}`}
                        >
                          {s}
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(s)}
                              className='ml-1.5 h-4 w-4 rounded-full hover:bg-destructive/20 flex items-center justify-center'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {data.skills.length === 0 && (
                        <p className='text-sm text-muted-foreground'>
                          No skills added yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
