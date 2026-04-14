import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useUpdateProfile } from '@/hooks/useUser';
import { toast } from 'sonner';

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
    skills: user?.skills.join(', ') || '',
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

  return (
    <div>
      {/* Header */}
      <div className="page-header flex justify-between items-start">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="card-modern p-8">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">First Name</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Last Name</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Bio</label>
              <textarea
                rows={3}
                className="input-modern resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Location</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Website</label>
                <input
                  type="url"
                  className="input-modern"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">GitHub Username</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Twitter Username</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Avatar URL</label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className="input-modern"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                Skills <span className="text-muted-foreground">(comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="React, Node.js, Python"
                className="input-modern"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="btn-primary"
              >
                {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Profile header row */}
            <div className="flex items-center gap-4">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20" />
              ) : (
                <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            {user?.bio && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Bio</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}

            {user?.location && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Location</h4>
                <p className="text-foreground/80 text-sm">📍 {user.location}</p>
              </div>
            )}

            {(user?.github || user?.twitter || user?.website) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Links</h4>
                <div className="space-y-1.5">
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                      🌐 {user.website}
                    </a>
                  )}
                  {user.github && (
                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                      💻 @{user.github}
                    </a>
                  )}
                  {user.twitter && (
                    <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                      🐦 @{user.twitter}
                    </a>
                  )}
                </div>
              </div>
            )}

            {user?.skills && user.skills.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string) => (
                    <span key={skill} className="tag-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
