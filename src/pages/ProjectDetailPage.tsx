import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Users,
  ArrowRight,
  Code,
  Pencil,
  UserPlus,
  Check,
  X,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PageTransition } from '@/components/PageTransition';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { projectsApi, usersApi } from '@/services/mockApi';
import { mockUsers, type Project, type MockUser } from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-green-500/10 text-green-600 border-green-500/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  closed: 'bg-muted text-muted-foreground border-border',
  declined: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    techStack: '',
    openRoles: '',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [allDevs, setAllDevs] = useState<MockUser[]>([]);
  const [inviting, setInviting] = useState<string | null>(null);

  // Apply modal
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ role: '', message: '' });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    projectsApi
      .getById(id || '')
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
    usersApi.getAll().then(setAllDevs);
  }, [id]);

  const isOwner = project?.ownerId === user?.id;
  const isMember = project?.members.includes(user?.id || '') || false;
  const hasApplied = project?.applicants.includes(user?.id || '') || false;

  const refreshProject = async () => {
    if (!id) return;
    const p = await projectsApi.getById(id);
    setProject(p);
  };

  // ---- Edit ----
  const openEdit = () => {
    if (!project) return;
    setEditForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      openRoles: project.openRoles.join(', '),
      status: project.status,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!project || !editForm.title.trim()) return;
    setSaving(true);
    try {
      const updated = await projectsApi.update(project.id, {
        title: editForm.title,
        description: editForm.description,
        techStack: editForm.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        openRoles: editForm.openRoles
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        status: editForm.status as Project['status'],
      });
      setProject(updated);
      setEditOpen(false);

      toast.success('Project updated!');
    } catch {
      toast.error('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  // ---- Accept / Reject collab ----
  const handleAcceptCollab = async (collabId: string) => {
    if (!project) return;
    await projectsApi.acceptCollaboration(project.id, collabId);
    await refreshProject();
    toast.success('Collaboration accepted!');
  };

  const handleRejectCollab = async (collabId: string) => {
    if (!project) return;
    await projectsApi.rejectCollaboration(project.id, collabId);
    await refreshProject();
    toast.success('Collaboration declined.');
  };

  // ---- Invite ----
  const openInvite = () => {
    setInviteSearch('');
    setInviteRole(project?.openRoles[0] || '');
    setInviteOpen(true);
  };

  const handleInvite = async (userId: string) => {
    if (!project) return;
    setInviting(userId);
    try {
      await projectsApi.inviteDeveloper(project.id, userId, inviteRole);
      await refreshProject();
      toast.success('Invitation sent!');
    } catch {
      toast.error('Failed to invite developer.');
    } finally {
      setInviting(null);
    }
  };

  const invitableDevs = allDevs.filter((d) => {
    if (!project) return false;
    if (project.members.includes(d.id)) return false;
    if (
      project.invitations.some(
        (inv) => inv.userId === d.id && inv.status === 'pending',
      )
    )
      return false;
    if (d.id === user?.id) return false;
    if (inviteSearch) {
      const q = inviteSearch.toLowerCase();
      return (
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
        d.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // ---- Apply ----
  const openApply = () => {
    if (!project) return;
    setApplyForm({ role: project.openRoles[0] || '', message: '' });
    setApplyOpen(true);
  };

  const handleApply = async () => {
    if (!project || !user) return;
    setApplying(true);
    try {
      await projectsApi.apply(
        project.id,
        user.id,
        applyForm.role,
        applyForm.message,
      );
      await refreshProject();
      setApplyOpen(false);
      toast.success('Application submitted!');
    } catch {
      toast.error('Failed to apply.');  
    } finally {
      setApplying(false);
    }
  };

  const pendingCollabs =
    project?.collaborationRequests.filter((c) => c.status === 'pending') || [];

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader
        backTo={{ label: 'Back to Projects', href: '/projects' }}
      />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl'>
          {loading ? (
            <SkeletonCard lines={5} />
          ) : !project ? (
            <Card className='glass border-border/50 shadow-card'>
              <CardContent className='py-16 text-center'>
                <p className='text-muted-foreground'>Project not found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-6'>
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className='glass border-border/50 shadow-card'>
                  <CardHeader>
                    <div className='flex items-start justify-between flex-wrap gap-3'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-3 mb-2'>
                          <CardTitle className='text-2xl font-heading'>
                            {project.title}
                          </CardTitle>
                          <Badge
                            variant={
                              project.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                            className={
                              project.status === 'active'
                                ? 'gradient-primary text-primary-foreground border-0'
                                : ''
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className='mt-1'>
                          {project.description}
                        </CardDescription>
                      </div>
                      {isOwner && (
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={openEdit}
                          >
                            <Pencil className='h-4 w-4 mr-1' />
                            Edit
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={openInvite}
                          >
                            <UserPlus className='h-4 w-4 mr-1' />
                            Invite
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {project.techStack.map((t) => (
                        <Badge key={t} variant='outline'>
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground flex-wrap'>
                      <span className='flex items-center gap-1'>
                        <Users className='h-4 w-4' />
                        {project.members.length} members
                      </span>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        Created{' '}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        Updated{' '}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      {project.openRoles.length > 0 && (
                        <span className='flex items-center gap-1'>
                          <Code className='h-4 w-4' />
                          {project.openRoles.length} open role
                          {project.openRoles.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {project.openRoles.length > 0 && !isOwner && !isMember && (
                      <div className='mt-4'>
                        <Button
                          className='gradient-primary border-0 shadow-glow font-medium'
                          disabled={hasApplied}
                          onClick={openApply}
                        >
                          {hasApplied
                            ? 'Application Submitted'
                            : 'Apply to Join'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='space-y-6'
              >
                <TabsList className='glass border border-border/50 p-1 h-auto'>
                  <TabsTrigger
                    value='overview'
                    className='data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground'
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value='team'
                    className='data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5'
                  >
                    <Users className='h-3.5 w-3.5' />
                    Team ({project.members.length})
                  </TabsTrigger>
                  {isOwner && (
                    <TabsTrigger
                      value='requests'
                      className='data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5'
                    >
                      <MessageSquare className='h-3.5 w-3.5' />
                      Requests
                      {pendingCollabs.length > 0 && (
                        <Badge className='gradient-primary text-primary-foreground border-0 ml-1 h-5 w-5 rounded-full p-0 text-xs'>
                          {pendingCollabs.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value='invitations'
                    className='data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5'
                  >
                    <Mail className='h-3.5 w-3.5' />
                    Invitations
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value='overview' className='space-y-6'>
                  <div className='grid gap-6 lg:grid-cols-2'>
                    {/* Open Roles */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Card className='glass border-border/50 shadow-card h-full'>
                        <CardHeader>
                          <CardTitle className='text-sm font-heading flex items-center gap-2'>
                            <Code className='h-4 w-4' />
                            Open Roles
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {project.openRoles.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>
                              No open roles at the moment.
                            </p>
                          ) : (
                            <div className='space-y-3'>
                              {project.openRoles.map((role) => {
                                const applicantsForRole =
                                  project.collaborationRequests.filter(
                                    (c) => c.role === role,
                                  );
                                return (
                                  <div
                                    key={role}
                                    className='p-3 rounded-xl border border-border/30 hover:bg-muted/50 transition-colors'
                                  >
                                    <div className='flex items-center justify-between mb-1'>
                                      <span className='text-sm font-medium'>
                                        {role}
                                      </span>
                                      <Badge
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        Open
                                      </Badge>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                      {applicantsForRole.length} applicant
                                      {applicantsForRole.length !== 1
                                        ? 's'
                                        : ''}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className='glass border-border/50 shadow-card h-full'>
                        <CardHeader>
                          <CardTitle className='text-sm font-heading'>
                            Project Stats
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                          {[
                            {
                              label: 'Team Members',
                              value: project.members.length,
                              icon: Users,
                            },
                            {
                              label: 'Open Roles',
                              value: project.openRoles.length,
                              icon: Code,
                            },
                            {
                              label: 'Pending Applications',
                              value: project.collaborationRequests.filter(
                                (c) => c.status === 'pending',
                              ).length,
                              icon: Clock,
                            },
                            {
                              label: 'Pending Invitations',
                              value: project.invitations.filter(
                                (i) => i.status === 'pending',
                              ).length,
                              icon: Send,
                            },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors'
                            >
                              <div className='flex items-center gap-2'>
                                <stat.icon className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm'>{stat.label}</span>
                              </div>
                              <span className='font-heading font-semibold'>
                                {stat.value}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value='team' className='space-y-4'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader>
                      <CardTitle className='text-sm font-heading flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        Team Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {project.members.map((mid) => {
                        const m = mockUsers.find((u) => u.id === mid);
                        if (!m) return null;
                        return (
                          <motion.div
                            key={mid}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-border/20'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='relative'>
                                <Avatar className='h-10 w-10 ring-2 ring-primary/10'>
                                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                                    {m.firstName[0]}
                                    {m.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                {m.isOnline && (
                                  <div className='absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500' />
                                )}
                              </div>
                              <div>
                                <p className='text-sm font-medium'>
                                  {m.firstName} {m.lastName}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  {mid === project.ownerId ? 'Owner' : 'Member'}
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='flex gap-1'>
                                {m.skills.slice(0, 2).map((s) => (
                                  <Badge
                                    key={s}
                                    variant='outline'
                                    className='text-xs'
                                  >
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                              <Button size='sm' variant='ghost' asChild>
                                <Link to={`/profile/${mid}`}>
                                  <ArrowRight className='h-4 w-4' />
                                </Link>
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Requests Tab (Owner only) */}
                {isOwner && (
                  <TabsContent value='requests' className='space-y-4'>
                    <Card className='glass border-border/50 shadow-card'>
                      <CardHeader>
                        <CardTitle className='text-sm font-heading flex items-center gap-2'>
                          <MessageSquare className='h-4 w-4' />
                          Collaboration Requests
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          Review and manage applications from developers
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        {project.collaborationRequests.length === 0 ? (
                          <EmptyState
                            icon={MessageSquare}
                            title='No requests yet'
                            description='Requests will appear here when developers apply.'
                          />
                        ) : (
                          project.collaborationRequests.map((collab, i) => {
                            const applicant = mockUsers.find(
                              (u) => u.id === collab.userId,
                            );
                            if (!applicant) return null;
                            return (
                              <motion.div
                                key={collab.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className='p-4 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors'
                              >
                                <div className='flex items-start justify-between gap-3 flex-wrap'>
                                  <div className='flex items-start gap-3'>
                                    <Avatar className='h-10 w-10 ring-2 ring-primary/10'>
                                      <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                                        {applicant.firstName[0]}
                                        {applicant.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className='flex items-center gap-2'>
                                        <Link
                                          to={`/profile/${applicant.id}`}
                                          className='text-sm font-medium hover:text-primary transition-colors'
                                        >
                                          {applicant.firstName}{' '}
                                          {applicant.lastName}
                                        </Link>
                                        <Badge
                                          variant='outline'
                                          className='text-xs'
                                        >
                                          {collab.role}
                                        </Badge>
                                      </div>
                                      <p className='text-sm text-muted-foreground mt-1'>
                                        {collab.message}
                                      </p>
                                      <div className='flex items-center gap-2 mt-2'>
                                        <Calendar className='h-3 w-3 text-muted-foreground' />
                                        <span className='text-xs text-muted-foreground'>
                                          {new Date(
                                            collab.createdAt,
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    {collab.status === 'pending' ? (
                                      <>
                                        <Button
                                          size='sm'
                                          className='gradient-primary border-0 shadow-glow'
                                          onClick={() =>
                                            handleAcceptCollab(collab.id)
                                          }
                                        >
                                          <UserCheck className='h-4 w-4 mr-1' />
                                          Accept
                                        </Button>
                                        <Button
                                          size='sm'
                                          variant='outline'
                                          onClick={() =>
                                            handleRejectCollab(collab.id)
                                          }
                                        >
                                          <UserX className='h-4 w-4 mr-1' />
                                          Reject
                                        </Button>
                                      </>
                                    ) : (
                                      <Badge
                                        className={`border text-xs ${statusColors[collab.status]}`}
                                      >
                                        {collab.status.charAt(0).toUpperCase() +
                                          collab.status.slice(1)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* Invitations Tab */}
                <TabsContent value='invitations' className='space-y-4'>
                  <Card className='glass border-border/50 shadow-card'>
                    <CardHeader>
                      <CardTitle className='text-sm font-heading flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        Invitations
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        {isOwner
                          ? 'Track invitations you have sent to developers'
                          : 'Invitations for this project'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {project.invitations.length === 0 ? (
                        <EmptyState
                          icon={Mail}
                          title='No invitations'
                          description={
                            isOwner
                              ? 'Invite developers to collaborate on your project.'
                              : 'No invitations yet.'
                          }
                          action={
                            isOwner ? (
                              <Button variant='outline' onClick={openInvite}>
                                <UserPlus className='h-4 w-4 mr-1' />
                                Invite Developer
                              </Button>
                            ) : undefined
                          }
                        />
                      ) : (
                        project.invitations.map((inv, i) => {
                          const invitee = mockUsers.find(
                            (u) => u.id === inv.userId,
                          );
                          if (!invitee) return null;
                          return (
                            <motion.div
                              key={inv.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className='flex items-center justify-between p-3 rounded-xl border border-border/20 hover:bg-muted/30 transition-colors'
                            >
                              <div className='flex items-center gap-3'>
                                <Avatar className='h-9 w-9'>
                                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                                    {invitee.firstName[0]}
                                    {invitee.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className='text-sm font-medium'>
                                    {invitee.firstName} {invitee.lastName}
                                  </p>
                                  <p className='text-xs text-muted-foreground'>
                                    Invited as {inv.role}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={`border text-xs ${statusColors[inv.status]}`}
                              >
                                {inv.status.charAt(0).toUpperCase() +
                                  inv.status.slice(1)}
                              </Badge>
                            </motion.div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </PageTransition>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='glass sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-heading'>Edit Project</DialogTitle>
            <DialogDescription>Update your project details.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, description: e.target.value }))
                }
                className='min-h-[100px]'
              />
            </div>
            <div className='space-y-2'>
              <Label>
                Tech Stack{' '}
                <span className='text-xs text-muted-foreground'>
                  (comma-separated)
                </span>
              </Label>
              <Input
                value={editForm.techStack}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, techStack: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>
                Open Roles{' '}
                <span className='text-xs text-muted-foreground'>
                  (comma-separated)
                </span>
              </Label>
              <Input
                value={editForm.openRoles}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, openRoles: e.target.value }))
                }
              />
            </div>
            <div className='space-y-2'>
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) => setEditForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className='gradient-primary border-0 shadow-glow font-medium'
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className='glass sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-heading'>Invite Developer</DialogTitle>
            <DialogDescription>
              Search and invite developers to join your project.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            {project && project.openRoles.length > 0 && (
              <div className='space-y-2'>
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {project.openRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search developers...'
                value={inviteSearch}
                onChange={(e) => setInviteSearch(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {invitableDevs.length === 0 ? (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No developers found
                </p>
              ) : (
                invitableDevs.slice(0, 6).map((dev) => (
                  <div
                    key={dev.id}
                    className='flex items-center justify-between p-3 rounded-xl border border-border/20 hover:bg-muted/30 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarFallback className='bg-primary/10 text-primary text-xs font-heading'>
                          {dev.firstName[0]}
                          {dev.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>
                          {dev.firstName} {dev.lastName}
                        </p>
                        <div className='flex gap-1 mt-0.5'>
                          {dev.skills.slice(0, 3).map((s) => (
                            <Badge
                              key={s}
                              variant='outline'
                              className='text-[10px] py-0 px-1.5'
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      size='sm'
                      className='gradient-primary border-0 shadow-glow'
                      onClick={() => handleInvite(dev.id)}
                      disabled={inviting === dev.id}
                    >
                      {inviting === dev.id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <>
                          <Send className='h-3.5 w-3.5 mr-1' />
                          Invite
                        </>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className='glass sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-heading'>
              Apply to {project?.title}
            </DialogTitle>
            <DialogDescription>
              Tell the owner why you would be a great fit.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            {project && project.openRoles.length > 0 && (
              <div className='space-y-2'>
                <Label>Role</Label>
                <Select
                  value={applyForm.role}
                  onValueChange={(v) =>
                    setApplyForm((p) => ({ ...p, role: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    {project.openRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='space-y-2'>
              <Label>Message</Label>
              <Textarea
                value={applyForm.message}
                onChange={(e) =>
                  setApplyForm((p) => ({ ...p, message: e.target.value }))
                }
                placeholder='Why are you interested in this project?'
                className='min-h-[100px]'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button
              className='gradient-primary border-0 shadow-glow font-medium'
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
