import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useApplyToProject,
  useRespondToCollaboration,
  useInviteUser,
  useProjectCollaborations,
} from '@/hooks/useProjects';
import { useSearchUsers } from '@/hooks/useUser';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Shield, Briefcase, ChevronRight, Layout, MessageSquare } from 'lucide-react';
import type { Project, UpdateProjectData, CollaborationRequest } from '@/types/api';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { data: project, isLoading, refetch } = useProject(id || '', !!id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const applyToProject = useApplyToProject();
  const respondToCollaboration = useRespondToCollaboration();
  const inviteUserMutation = useInviteUser();

  const isOwner = project && (typeof project.owner === 'object'
    ? project.owner.id === user?.id
    : project.owner === user?.id);

  const { data: collaborations } = useProjectCollaborations(id || '', !!id && !!isOwner);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    techStack: '',
    openRoles: '',
    status: 'ACTIVE' as Project['status'],
  });

  // Apply state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyForm, setApplyForm] = useState({ role: '', message: '' });

  // Invite state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const { data: searchResults } = useSearchUsers(
    { query: inviteSearch },
    showInviteForm && inviteSearch.length > 0
  );

  // Active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'requests' | 'invitations'>('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card-modern p-12 text-center">
        <div className="text-4xl mb-4">◈</div>
        <p className="text-foreground font-medium mb-2">Project not found</p>
        <button onClick={() => navigate('/projects')} className="text-sm text-primary hover:text-primary/80 transition-colors">
          ← Back to Projects
        </button>
      </div>
    );
  }

  const isMember = project.members.some((m: { user: string | { id: string }; joinedAt: string }) => {
    const memberUser = typeof m.user === 'object' ? m.user.id : m.user;
    return memberUser === user?.id;
  });

  // Edit handlers
  const openEdit = () => {
    setEditForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      openRoles: project.openRoles.join(', '),
      status: project.status,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) return;
    try {
      const data: UpdateProjectData = {
        title: editForm.title,
        description: editForm.description,
        techStack: editForm.techStack.split(',').map((s: string) => s.trim()).filter(Boolean),
        openRoles: editForm.openRoles.split(',').map((s: string) => s.trim()).filter(Boolean),
        status: editForm.status,
      };
      await updateProject.mutateAsync({ projectId: project.id, data });
      setIsEditing(false);
      toast.success('Project updated!');
    } catch {
      toast.error('Failed to update project.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success('Project deleted!');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project.');
    }
  };

  // Apply handler
  const handleApply = async () => {
    if (!applyForm.role.trim() || !applyForm.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    try {
      await applyToProject.mutateAsync({
        projectId: project.id,
        data: applyForm,
      });
      setShowApplyForm(false);
      setApplyForm({ role: '', message: '' });
      toast.success('Application submitted!');
    } catch {
      toast.error('Failed to apply.');
    }
  };

  // Invite handler
  const handleInvite = async (userId: string) => {
    if (!inviteRole.trim()) {
      toast.error('Please specify a role.');
      return;
    }
    try {
      await inviteUserMutation.mutateAsync({
        projectId: project.id,
        data: { userId, role: inviteRole },
      });
      toast.success('Invitation sent!');
      refetch();
    } catch {
      toast.error('Failed to invite user.');
    }
  };

  // Respond to collaboration
  const handleRespondCollab = async (collaborationId: string, accept: boolean) => {
    try {
      await respondToCollaboration.mutateAsync({
        projectId: project.id,
        collaborationId,
        accept,
      });
      toast.success(accept ? 'Request accepted!' : 'Request rejected.');
    } catch {
      toast.error('Failed to respond.');
    }
  };

  const ownerName = typeof project.owner === 'object'
    ? `${project.owner.firstName} ${project.owner.lastName}`
    : 'Owner';

  const invitableDevs = (searchResults?.data || []).filter((d: { id: string }) => {
    if (d.id === user?.id) return false;
    const isMemberAlready = project.members.some((m: { user: string | { id: string } }) => {
      const mid = typeof m.user === 'object' ? m.user.id : m.user;
      return mid === d.id;
    });
    return !isMemberAlready;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Project Hero Card */}
      <div className="card-modern p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-40" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                  {project.title}
                </h1>
                <span className={`tag-${project.status === 'ACTIVE' ? 'success' : 'muted'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
            </div>
            {isOwner && (
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={openEdit} className="btn-secondary text-xs">Edit</button>
                <button onClick={handleDelete} className="btn-danger text-xs">Delete</button>
                <button onClick={() => setShowInviteForm(!showInviteForm)} className="btn-primary text-xs">Invite</button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((t: string) => (
              <span key={t} className="tag-primary">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span>{project.members.length} members</span>
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            <span>Owner: {ownerName}</span>
            {project.openRoles.length > 0 && <span className="text-accent">{project.openRoles.length} open roles</span>}
          </div>
          {!isOwner && !isMember && project.openRoles.length > 0 && (
            <div className="mt-4">
              <button onClick={() => setShowApplyForm(!showApplyForm)} className="btn-accent">
                Apply to Join
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div className="card-modern p-6 mb-6">
          <h3 className="section-title mb-4">Apply to Join</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
              <select
                className="input-modern"
                value={applyForm.role}
                onChange={(e) => setApplyForm({ ...applyForm, role: e.target.value })}
              >
                <option value="">Select a role</option>
                {project.openRoles.map((role: string) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Message</label>
              <textarea
                rows={3}
                className="input-modern resize-none"
                placeholder="Why would you like to join?"
                value={applyForm.message}
                onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleApply} disabled={applyToProject.isPending} className="btn-primary">
                {applyToProject.isPending ? 'Submitting…' : 'Submit Application'}
              </button>
              <button onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Form */}
      {showInviteForm && isOwner && (
        <div className="card-modern p-6 mb-6">
          <h3 className="section-title mb-4">Invite a Developer</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Role</label>
              <input type="text" className="input-modern" placeholder="e.g. Frontend Developer" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Search Users</label>
              <input type="text" className="input-modern" placeholder="Search by name…" value={inviteSearch} onChange={(e) => setInviteSearch(e.target.value)} />
            </div>
            {invitableDevs.length > 0 && (
              <div className="card-modern divide-y divide-border/30">
                {invitableDevs.map((dev) => (
                  <div key={dev.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {dev.firstName[0]}{dev.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{dev.firstName} {dev.lastName}</p>
                        <p className="text-xs text-muted-foreground">{dev.skills.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                    <button onClick={() => handleInvite(dev.id)} disabled={inviteUserMutation.isPending} className="btn-primary text-xs py-1.5 px-3">
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="card-modern p-6 mb-6">
          <h3 className="section-title mb-4">Edit Project</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Title</label>
              <input type="text" className="input-modern" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Description</label>
              <textarea rows={3} className="input-modern resize-none" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Tech Stack <span className="text-muted-foreground">(comma-separated)</span></label>
                <input type="text" className="input-modern" value={editForm.techStack} onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">Open Roles <span className="text-muted-foreground">(comma-separated)</span></label>
                <input type="text" className="input-modern" value={editForm.openRoles} onChange={(e) => setEditForm({ ...editForm, openRoles: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Status</label>
              <select className="input-modern" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Project['status'] })}>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} disabled={updateProject.isPending} className="btn-primary">
                {updateProject.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-card/40 rounded-lg p-1 border border-border/30 w-fit">
        {(['overview', 'team', ...(isOwner ? ['requests'] : []), 'invitations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-modern p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Open Roles</h3>
            {project.openRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open roles at the moment.</p>
            ) : (
              <div className="space-y-2">
                {project.openRoles.map((role: string) => (
                  <div key={role} className="p-3 rounded-lg border border-border/30 bg-muted/20 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{role}</span>
                    <span className="tag-success">Open</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card-modern p-6">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Project Stats</h3>
            <div className="space-y-2">
              {[
                { label: 'Team Members', value: project.members.length },
                { label: 'Open Roles', value: project.openRoles.length },
                { label: 'Tech Stack', value: project.techStack.length },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="card-modern p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
            Team Members ({project.members.length})
          </h3>
          <div className="space-y-2">
            {project.members.map((member, i) => {
              const memberUser = typeof member.user === 'object' ? member.user : null;
              const memberId = typeof member.user === 'object' ? member.user.id : member.user;
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {memberUser ? `${memberUser.firstName[0]}${memberUser.lastName[0]}` : '??'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{memberUser ? `${memberUser.firstName} ${memberUser.lastName}` : memberId}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link to={`/profile/${memberId}`} className="text-primary text-sm hover:text-primary/80 transition-colors">View →</Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Requests Tab (Owner only) */}
      {activeTab === 'requests' && isOwner && (
        <div className="card-modern p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Collaboration Requests</h3>
          {!collaborations || collaborations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending collaboration requests.</p>
          ) : (
            <div className="space-y-3">
              {collaborations.map((req: CollaborationRequest) => (
                <div key={req.id} className="rounded-lg border border-border/30 bg-muted/20 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        {req.user.firstName[0]}{req.user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{req.user.firstName} {req.user.lastName}</p>
                        <p className="text-xs text-muted-foreground">Applied for <span className="text-primary font-semibold">{req.role}</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                        {req.user.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {req.user.skills.map((skill: string) => (
                              <span key={skill} className="tag-muted">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      <button onClick={() => handleRespondCollab(req.id, false)} disabled={respondToCollaboration.isPending} className="btn-danger text-xs py-1.5 px-3">Reject</button>
                      <button onClick={() => handleRespondCollab(req.id, true)} disabled={respondToCollaboration.isPending} className="btn-primary text-xs py-1.5 px-3">Accept</button>
                    </div>
                  </div>
                  <div className="mt-3 bg-card/50 p-3 rounded-lg text-sm text-foreground/70 italic border border-border/20">
                    "{req.message}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <div className="card-modern p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Invitations</h3>
          <p className="text-sm text-muted-foreground">
            {isOwner ? 'Track invitations you have sent to developers.' : 'Invitations for this project.'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
