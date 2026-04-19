import { Link } from 'react-router-dom';
import type { Project } from '@/types/api';

interface ProjectCardProps {
  project: Project;
  currentUserId?: string;
  onApply?: (projectId: string) => void;
  onEdit?: () => void;
}

export function ProjectCard({
  project,
  currentUserId,
  onApply,
  onEdit,
}: ProjectCardProps) {
  const owner = typeof project.owner === 'object' ? project.owner : null;
  const isOwner = owner?.id === currentUserId;
  const isMember = project.members.some((m) => {
    const mid = typeof m.user === 'object' ? m.user.id : m.user;
    return mid === currentUserId;
  });

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all h-full flex flex-col p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate text-gray-900">
            {project.title}
          </h3>
          {owner && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-semibold text-indigo-600">
                {owner.firstName[0]}{owner.lastName[0]}
              </div>
              <span className="text-xs text-gray-500">
                {owner.firstName} {owner.lastName}
              </span>
            </div>
          )}
        </div>
        <span className={`px-2 py-0.5 text-xs rounded ${
          project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {project.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="px-2 py-0.5 border border-gray-200 text-gray-700 text-xs rounded">
            {tech}
          </span>
        ))}
        {project.techStack.length > 4 && (
          <span className="px-2 py-0.5 border border-gray-200 text-gray-500 text-xs rounded">
            +{project.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Open roles preview */}
      {project.openRoles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.openRoles.slice(0, 2).map((role) => (
            <span key={role} className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">
              {role}
            </span>
          ))}
          {project.openRoles.length > 2 && (
            <span className="text-xs text-gray-500">+{project.openRoles.length - 2} more</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{project.members.length} members</span>
          <span>{new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex gap-1.5">
          {isOwner && onEdit && (
            <button onClick={onEdit} className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900">
              Edit
            </button>
          )}
          {project.openRoles.length > 0 && !isOwner && !isMember && (
            <button
              onClick={() => onApply?.(project.id)}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
            >
              Apply
            </button>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-700"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
