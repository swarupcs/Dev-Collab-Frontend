import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  projectService,
  type ProjectQuery,
} from '@/services/project.service';
import type { CreateProjectData, UpdateProjectData } from '@/types/api';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectQuery) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  invitations: () => [...projectKeys.all, 'invitations'] as const,
};

// Get all projects
export const useProjects = (query: ProjectQuery = {}) => {
  return useQuery({
    queryKey: projectKeys.list(query),
    queryFn: () => projectService.getProjects(query),
    staleTime: 2 * 60 * 1000,
  });
};

// Get project by ID
export const useProject = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => projectService.getProjectById(projectId),
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectData;
    }) => projectService.updateProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

// Apply to project mutation
export const useApplyToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: { role: string; message: string };
    }) => projectService.applyToProject(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Respond to collaboration mutation
export const useRespondToCollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      collaborationId,
      accept,
    }: {
      projectId: string;
      collaborationId: string;
      accept: boolean;
    }) =>
      projectService.respondToCollaboration(projectId, collaborationId, accept),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Invite user mutation
export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: { userId: string; role: string };
    }) => projectService.inviteUser(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// Get my invitations
export const useMyInvitations = () => {
  return useQuery({
    queryKey: projectKeys.invitations(),
    queryFn: projectService.getMyInvitations,
    staleTime: 1 * 60 * 1000,
  });
};

// Respond to invitation mutation
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      invitationId,
      accept,
    }: {
      projectId: string;
      invitationId: string;
      accept: boolean;
    }) => projectService.respondToInvitation(projectId, invitationId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.invitations() });
    },
  });
};
