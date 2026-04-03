import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Calendar,
  ArrowRight,
  Pencil,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project } from '@/services/mockData';
import { mockUsers } from '@/services/mockData';

interface ProjectCardProps {
  project: Project;
  index?: number;
  currentUserId?: string;
  onApply?: (projectId: string) => void;
  onEdit?: () => void;
}

export function ProjectCard({
  project,
  index = 0,
  currentUserId,
  onApply,
  onEdit,
}: ProjectCardProps) {
  const owner = mockUsers.find((u) => u.id === project.ownerId);
  const isOwner = currentUserId === project.ownerId;
  const isMember = project.members.includes(currentUserId || '');
  const hasApplied = project.applicants.includes(currentUserId || '');
  const pendingCollabs = project.collaborationRequests.filter(
    (c) => c.status === 'pending',
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className='glass border-border/50 shadow-card hover:shadow-card-hover transition-all h-full flex flex-col'>
        <CardContent className='p-5 flex flex-col flex-1'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex-1 min-w-0'>
              <h3 className='font-heading font-semibold text-base truncate'>
                {project.title}
              </h3>
              {owner && (
                <div className='flex items-center gap-1.5 mt-1'>
                  <Avatar className='h-5 w-5'>
                    <AvatarFallback className='bg-primary/10 text-primary text-[10px] font-heading'>
                      {owner.firstName[0]}
                      {owner.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-xs text-muted-foreground'>
                    {owner.firstName} {owner.lastName}
                  </span>
                </div>
              )}
            </div>
            <div className='flex items-center gap-1.5'>
              {isOwner && pendingCollabs > 0 && (
                <Badge className='gradient-primary text-primary-foreground border-0 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center'>
                  {pendingCollabs}
                </Badge>
              )}
              <Badge
                variant={project.status === 'active' ? 'default' : 'secondary'}
                className={
                  project.status === 'active'
                    ? 'gradient-primary text-primary-foreground border-0 text-xs'
                    : 'text-xs'
                }
              >
                {project.status}
              </Badge>
            </div>
          </div>

          <p className='text-sm text-muted-foreground mb-4 line-clamp-2 flex-1'>
            {project.description}
          </p>

          <div className='flex flex-wrap gap-1.5 mb-4'>
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant='outline' className='text-xs'>
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge variant='outline' className='text-xs'>
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>

          {/* Open roles preview */}
          {project.openRoles.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-3'>
              {project.openRoles.slice(0, 2).map((role) => (
                <span
                  key={role}
                  className='text-xs text-primary bg-primary/5 border border-primary/20 rounded-full px-2 py-0.5'
                >
                  {role}
                </span>
              ))}
              {project.openRoles.length > 2 && (
                <span className='text-xs text-muted-foreground'>
                  +{project.openRoles.length - 2} more
                </span>
              )}
            </div>
          )}

          <div className='flex items-center justify-between mt-auto pt-3 border-t border-border/30'>
            <div className='flex items-center gap-3 text-xs text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <Users className='h-3.5 w-3.5' />
                {project.members.length}
              </span>
              <span className='flex items-center gap-1'>
                <Calendar className='h-3.5 w-3.5' />
                {new Date(project.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className='flex gap-1.5'>
              {isOwner && onEdit && (
                <Button size='sm' variant='ghost' onClick={onEdit}>
                  <Pencil className='h-3.5 w-3.5' />
                </Button>
              )}
              {project.openRoles.length > 0 && !isOwner && !isMember && (
                <Button
                  size='sm'
                  className={
                    hasApplied
                      ? ''
                      : 'gradient-primary border-0 shadow-glow font-medium'
                  }
                  variant={hasApplied ? 'outline' : 'default'}
                  disabled={hasApplied}
                  onClick={() => onApply?.(project.id)}
                >
                  {hasApplied ? 'Applied' : 'Apply'}
                </Button>
              )}
              <Button size='sm' variant='ghost' asChild>
                <Link to={`/projects/${project.id}`}>
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
