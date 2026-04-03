import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  FolderOpen,
  Pencil,
  Loader2,
  X,
  Inbox,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { PageTransition } from '@/components/PageTransition';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { projectsApi } from '@/services/mockApi';
import { type Project } from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    openRoles: '',
  });
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    techStack: '',
    openRoles: '',
    status: 'active' as string,
  });
  const [saving, setSaving] = useState(false);

  // Apply modal
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyTarget, setApplyTarget] = useState<Project | null>(null);
  const [applyForm, setApplyForm] = useState({ role: '', message: '' });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    projectsApi
      .getAll()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesOwnership =
      ownershipFilter === 'all' ||
      (ownershipFilter === 'mine' && p.ownerId === user?.id) ||
      (ownershipFilter === 'member' &&
        p.members.includes(user?.id || '') &&
        p.ownerId !== user?.id) ||
      (ownershipFilter === 'applied' && p.applicants.includes(user?.id || ''));
    return matchesSearch && matchesStatus && matchesOwnership;
  });

  // ---- Create ----
  const handleCreate = async () => {
    if (!newProject.title.trim()) return;
    setCreating(true);
    try {
      const created = await projectsApi.create({
        title: newProject.title,
        description: newProject.description,
        techStack: newProject.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        openRoles: newProject.openRoles
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        ownerId: user?.id || '',
        members: [user?.id || ''],
      });
      setProjects((prev) => [created, ...prev]);
      setCreateOpen(false);
      setNewProject({
        title: '',
        description: '',
        techStack: '',
        openRoles: '',
      });
      toast.success( `Project created! ${created.title} is now live.`);
    } catch {
      toast.error('Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  // ---- Edit ----
  const openEdit = (project: Project) => {
    setEditProject(project);
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
    if (!editProject || !editForm.title.trim()) return;
    setSaving(true);
    try {
      const updated = await projectsApi.update(editProject.id, {
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
      setProjects((prev) =>
        prev.map((p) => (p.id === editProject.id ? updated : p)),
      );
      setEditOpen(false);
      toast.success('Project updated!');
    } catch {
      toast.error('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  // ---- Apply with message ----
  const openApply = (project: Project) => {
    setApplyTarget(project);
    setApplyForm({ role: project.openRoles[0] || '', message: '' });
    setApplyOpen(true);
  };

  const handleApply = async () => {
    if (!applyTarget || !user) return;
    setApplying(true);
    try {
      const updated = await projectsApi.apply(
        applyTarget.id,
        user.id,
        applyForm.role,
        applyForm.message,
      );
      if (updated)
        setProjects((prev) =>
          prev.map((p) => (p.id === applyTarget.id ? { ...updated } : p)),
        );
      setApplyOpen(false);
      toast.success(
        'Application submitted! The project owner will review your request.',
      );
      
    } catch {
      toast.error('Failed to apply project.');
    } finally {
      setApplying(false);
    }
  };

  // Simple apply from card (no modal)
  const handleQuickApply = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      openApply(project);
    }
  };

  const myPendingInvitations = projects.flatMap((p) =>
    p.invitations
      .filter((inv) => inv.userId === user?.id && inv.status === 'pending')
      .map((inv) => ({ ...inv, project: p })),
  );

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader title='Projects' />
      <PageTransition>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Pending Invitations Banner */}
          {myPendingInvitations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6'
            >
              <Card className='border-l-4 border-l-primary glass border-border/50 shadow-card'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-heading flex items-center gap-2'>
                    <Inbox className='h-4 w-4' />
                    You have {myPendingInvitations.length} project invitation
                    {myPendingInvitations.length > 1 ? 's' : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {myPendingInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className='flex items-center justify-between p-3 rounded-xl bg-muted/30'
                    >
                      <div>
                        <p className='text-sm font-medium'>
                          {inv.project.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Invited as{' '}
                          <span className='text-foreground font-medium'>
                            {inv.role}
                          </span>
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          className='gradient-primary border-0 shadow-glow'
                          onClick={async () => {
                            await projectsApi.respondToInvitation(
                              inv.projectId,
                              inv.id,
                              true,
                            );
                            const refreshed = await projectsApi.getAll();
                            setProjects(refreshed);
                            toast({ title: 'Invitation accepted!' });
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={async () => {
                            await projectsApi.respondToInvitation(
                              inv.projectId,
                              inv.id,
                              false,
                            );
                            const refreshed = await projectsApi.getAll();
                            setProjects(refreshed);
                            toast({ title: 'Invitation declined.' });
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search & Filters */}
          <div className='flex flex-col sm:flex-row gap-3 mb-8'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search projects by name or tech...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={ownershipFilter} onValueChange={setOwnershipFilter}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Projects</SelectItem>
                <SelectItem value='mine'>My Projects</SelectItem>
                <SelectItem value='member'>Collaborating</SelectItem>
                <SelectItem value='applied'>Applied</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='archived'>Archived</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className='gradient-primary border-0 shadow-glow font-medium'>
                  <Plus className='h-4 w-4 mr-1' />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className='glass sm:max-w-lg'>
                <DialogHeader>
                  <DialogTitle className='font-heading'>
                    Create a Project
                  </DialogTitle>
                  <DialogDescription>
                    Share your idea and find collaborators.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 pt-2'>
                  <div className='space-y-2'>
                    <Label>Project Title</Label>
                    <Input
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder='My Awesome Project'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Description</Label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder='What does your project do?'
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
                      value={newProject.techStack}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          techStack: e.target.value,
                        }))
                      }
                      placeholder='React, TypeScript, Node.js'
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
                      value={newProject.openRoles}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          openRoles: e.target.value,
                        }))
                      }
                      placeholder='Frontend Developer, Designer'
                    />
                  </div>
                  <Button
                    className='w-full gradient-primary border-0 shadow-glow font-medium'
                    onClick={handleCreate}
                    disabled={creating || !newProject.title.trim()}
                  >
                    {creating ? (
                      <>
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Project Grid */}
          {loading ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title='No projects found'
              description='Try different search terms or create your own project.'
              action={
                <Button
                  className='gradient-primary border-0 shadow-glow'
                  onClick={() => setCreateOpen(true)}
                >
                  Create Project
                </Button>
              }
            />
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filtered.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  currentUserId={user?.id}
                  onApply={handleQuickApply}
                  onEdit={
                    p.ownerId === user?.id ? () => openEdit(p) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </PageTransition>

      {/* Edit Project Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='glass sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-heading'>Edit Project</DialogTitle>
            <DialogDescription>Update your project details.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            <div className='space-y-2'>
              <Label>Project Title</Label>
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
              disabled={saving || !editForm.title.trim()}
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

      {/* Apply to Project Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className='glass sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-heading'>
              Apply to {applyTarget?.title}
            </DialogTitle>
            <DialogDescription>
              Tell the owner why you'd be a great fit.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            {applyTarget && applyTarget.openRoles.length > 0 && (
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
                    {applyTarget.openRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='space-y-2'>
              <Label>
                Message{' '}
                <span className='text-xs text-muted-foreground'>
                  (optional)
                </span>
              </Label>
              <Textarea
                value={applyForm.message}
                onChange={(e) =>
                  setApplyForm((p) => ({ ...p, message: e.target.value }))
                }
                placeholder='Why are you interested in this project?'
                className='min-h-[80px]'
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
