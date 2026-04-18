import apiClient from '@/api/client';
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  CollaborationRequest,
  ProjectInvitation,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

export interface ProjectQuery {
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  ownership?: 'mine' | 'member' | 'applied';
  search?: string;
  page?: number;
  limit?: number;
}

export const projectService = {
  // Get all projects
  getProjects: async (
    query: ProjectQuery = {}
  ): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<
      ApiResponse<{ projects: Project[]; pagination: PaginatedResponse<Project>['pagination'] }>
    >('/projects', { params: query });
    
    return {
      data: response.data.data!.projects,
      pagination: response.data.data!.pagination,
    };
  },

  // Get project by ID
  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${projectId}`
    );
    return response.data.data!;
  },

  // Create project
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      '/projects',
      data
    );
    return response.data.data!;
  },

  // Update project
  updateProject: async (
    projectId: string,
    data: UpdateProjectData
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `/projects/${projectId}`,
      data
    );
    return response.data.data!;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },

  // Apply to project
  applyToProject: async (
    projectId: string,
    data: { role: string; message: string }
  ): Promise<CollaborationRequest> => {
    const response = await apiClient.post<ApiResponse<CollaborationRequest>>(
      `/projects/${projectId}/apply`,
      data
    );
    return response.data.data!;
  },

  // Get project collaboration requests
  getProjectCollaborations: async (
    projectId: string
  ): Promise<CollaborationRequest[]> => {
    const response = await apiClient.get<ApiResponse<CollaborationRequest[]>>(
      `/projects/${projectId}/collaborations`
    );
    return response.data.data!;
  },

  // Respond to collaboration request
  respondToCollaboration: async (
    projectId: string,
    collaborationId: string,
    accept: boolean
  ): Promise<void> => {
    await apiClient.post(
      `/projects/${projectId}/collaborations/${collaborationId}/respond`,
      { accept }
    );
  },

  // Invite user to project
  inviteUser: async (
    projectId: string,
    data: { userId: string; role: string }
  ): Promise<ProjectInvitation> => {
    const response = await apiClient.post<ApiResponse<ProjectInvitation>>(
      `/projects/${projectId}/invite`,
      data
    );
    return response.data.data!;
  },

  // Get my invitations
  getMyInvitations: async (): Promise<ProjectInvitation[]> => {
    const response = await apiClient.get<ApiResponse<ProjectInvitation[]>>(
      '/projects/invitations'
    );
    return response.data.data!;
  },

  // Respond to invitation
  respondToInvitation: async (
    projectId: string,
    invitationId: string,
    accept: boolean
  ): Promise<void> => {
    await apiClient.post(
      `/projects/${projectId}/invitations/${invitationId}/respond`,
      { accept }
    );
  },
};
