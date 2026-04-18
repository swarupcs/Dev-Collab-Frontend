import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useUpdateProfile } from '@/hooks/useUser';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Link as LinkIcon, Github, Twitter, Award, CheckCircle2, PenLine, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    skills: user?.skills?.join(', ') || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync({
        ...formData,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile');
    }
  };

  const calculateCompleteness = () => {
    if (!user) return 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.bio,
      user.location,
      user.website,
      user.github,
      user.twitter,
      user.avatarUrl,
      user.skills?.length > 0 ? true : '',
    ];
    const filled = fields.filter(v => Boolean(v)).length;
    return Math.round((filled / fields.length) * 100);
  };
  
  const completeness = calculateCompleteness();

  return (
    <div className="container mx-auto max-w-[1200px] py-8 px-4 sm:px-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left/Main Column: Profile Info & Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            {/* Cover Banner */}
            <div className="h-40 sm:h-52 bg-gradient-to-r from-primary/20 via-accent/20 to-background border-b border-border/50 relative">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-white/5 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
            </div>
            
            <div className="px-6 sm:px-10 pb-8 sm:pb-10 relative">
              {/* Profile Header (Avatar & Edit Button) */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4">
                <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-card bg-card shadow-xl ring-1 ring-border/50">
                  <AvatarImage src={user?.avatarUrl} alt={user?.firstName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-bold text-4xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="outline" 
                    className="rounded-full gap-2 px-6 shadow-sm hover:border-primary/50 hover:bg-primary/5"
                  >
                    <PenLine className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Form or View Mode */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form 
                    key="edit-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 pt-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">First Name</label>
                        <Input
                          type="text"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Last Name</label>
                        <Input
                          type="text"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Bio</label>
                      <Textarea
                        rows={3}
                        className="min-h-[100px] resize-y bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl p-4"
                        placeholder="Tell us a little bit about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Location</label>
                        <Input
                          type="text"
                          placeholder="e.g., San Francisco, CA"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl pl-10"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <MapPin className="absolute mt(-9) ml-3 h-4 w-4 text-muted-foreground" style={{ transform: 'translateY(-34px)' }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Website</label>
                        <Input
                          type="url"
                          placeholder="https://yourportfolio.com"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl pl-10"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                        <LinkIcon className="absolute mt(-9) ml-3 h-4 w-4 text-muted-foreground" style={{ transform: 'translateY(-34px)' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">GitHub</label>
                        <Input
                          type="text"
                          placeholder="Username"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl pl-10"
                          value={formData.github}
                          onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        />
                        <Github className="absolute mt(-9) ml-3 h-4 w-4 text-muted-foreground" style={{ transform: 'translateY(-34px)' }} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Twitter / X</label>
                        <Input
                          type="text"
                          placeholder="Username"
                          className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl pl-10"
                          value={formData.twitter}
                          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        />
                        <Twitter className="absolute mt(-9) ml-3 h-4 w-4 text-muted-foreground" style={{ transform: 'translateY(-34px)' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Avatar URL</label>
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Skills <span className="text-muted-foreground font-normal">(comma-separated)</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="React, Node.js, Python, Figma"
                        className="h-11 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/40">
                      <Button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="rounded-full px-8 shadow-md hover:shadow-lg transition-all"
                      >
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="rounded-full px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="view-mode"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Header Info */}
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm font-medium">
                        <span className="bg-muted px-2.5 py-0.5 rounded-md text-foreground">@{user?.username}</span>
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {user?.bio && (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-base">
                        <p>{user.bio}</p>
                      </div>
                    )}

                    {/* Meta Links */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      {user?.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      )}
                      {user?.website && (
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
                          <LinkIcon className="h-4 w-4" />
                          Portfolio
                        </a>
                      )}
                      {user?.github && (
                        <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground font-medium bg-muted px-3 py-1.5 rounded-lg border border-border/50 hover:bg-muted/80 transition-colors">
                          <Github className="h-4 w-4" />
                          {user.github}
                        </a>
                      )}
                      {user?.twitter && (
                        <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#1DA1F2] font-medium bg-[#1DA1F2]/5 px-3 py-1.5 rounded-lg border border-[#1DA1F2]/10 hover:bg-[#1DA1F2]/10 transition-colors">
                          <Twitter className="h-4 w-4" />
                          {user.twitter}
                        </a>
                      )}
                    </div>

                    {/* Skills */}
                    {user?.skills && user.skills.length > 0 && (
                      <div className="pt-4 border-t border-border/40">
                        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1.5 rounded-xl font-medium bg-muted/50 border border-border/50 text-foreground shadow-sm hover:bg-muted">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Completeness Widget */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
              <Award className="w-40 h-40 text-primary transform rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-bold mb-6">
                <Sparkles className="h-5 w-5" />
                <h3>Profile Status</h3>
              </div>
              
              <div className="flex items-end justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Completeness</span>
                <span className="text-2xl font-bold tracking-tight text-primary">{completeness}%</span>
              </div>
              
              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden border border-border/50 mb-6 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-primary h-full rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }} />
                </motion.div>
              </div>
              
              {completeness < 100 ? (
                <div className="bg-background rounded-2xl border border-border/50 p-4">
                  <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-accent" />
                    To Complete:
                  </p>
                  <ul className="text-sm space-y-2.5">
                    {!user?.bio && (
                      <li className="flex items-center gap-2 text-muted-foreground group cursor-pointer hover:text-foreground transition-colors" onClick={() => setIsEditing(true)}>
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Plus className="h-3 w-3" />
                        </div>
                        Add a short bio
                      </li>
                    )}
                    {!user?.location && (
                      <li className="flex items-center gap-2 text-muted-foreground group cursor-pointer hover:text-foreground transition-colors" onClick={() => setIsEditing(true)}>
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Plus className="h-3 w-3" />
                        </div>
                        Set your location
                      </li>
                    )}
                    {(!user?.skills || user.skills.length === 0) && (
                      <li className="flex items-center gap-2 text-muted-foreground group cursor-pointer hover:text-foreground transition-colors" onClick={() => setIsEditing(true)}>
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Plus className="h-3 w-3" />
                        </div>
                        List your skills
                      </li>
                    )}
                    {(!user?.github && !user?.website && !user?.twitter) && (
                      <li className="flex items-center gap-2 text-muted-foreground group cursor-pointer hover:text-foreground transition-colors" onClick={() => setIsEditing(true)}>
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Plus className="h-3 w-3" />
                        </div>
                        Add social links
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <span className="inline-block text-primary font-bold text-lg mb-1">
                    All Star Profile
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Your profile is highly visible and completely optimized for the community.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
