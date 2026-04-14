import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { useUserById } from '@/hooks/useUser';
import { useSendConnectionRequest } from '@/hooks/useConnections';
import { toast } from 'sonner';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state: RootState) => state.auth.user);
  const { data: profile, isLoading } = useUserById(id || '', !!id);
  const sendRequest = useSendConnectionRequest();

  const isOwnProfile = currentUser?.id === id;

  const handleConnect = async () => {
    if (!id) return;
    try {
      await sendRequest.mutateAsync(id);
      toast.success('Connection request sent!');
    } catch {
      toast.error('Failed to send connection request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card-modern p-12 text-center">
        <div className="text-4xl mb-4">◉</div>
        <p className="text-foreground font-medium mb-2">User not found</p>
        <button onClick={() => navigate(-1)} className="text-sm text-primary hover:text-primary/80 transition-colors">
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Hero */}
      <div className="card-modern overflow-hidden mb-6">
        <div className="h-32 gradient-primary relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex items-end justify-between -mt-12 mb-4">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.firstName} className="h-24 w-24 rounded-full object-cover border-4 border-card shadow-card bg-card ring-2 ring-primary/20" />
            ) : (
              <div className="h-24 w-24 rounded-full border-4 border-card shadow-card gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            )}
            <div className="flex gap-2">
              {!isOwnProfile && (
                <button
                  onClick={handleConnect}
                  disabled={sendRequest.isPending}
                  className="btn-primary"
                >
                  {sendRequest.isPending ? 'Sending…' : 'Connect'}
                </button>
              )}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-secondary"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{profile.email}</p>
          {profile.isOnline && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-sm text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-4">
          <div className="card-modern p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Details</h3>
            <div className="space-y-3">
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <span>📍</span> {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🌐</span>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 truncate transition-colors">
                    {profile.website.replace('https://', '')}
                  </a>
                </div>
              )}
              {profile.github && (
                <div className="flex items-center gap-2 text-sm">
                  <span>💻</span>
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    {profile.github}
                  </a>
                </div>
              )}
              {profile.twitter && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🐦</span>
                  <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    @{profile.twitter}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="card-modern p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>📅</span>
              Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Right Column - About & Skills */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-modern p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">About</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {profile.bio || 'No bio yet.'}
            </p>
          </div>

          <div className="card-modern p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Skills ({profile.skills.length})
            </h3>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="tag-primary">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
