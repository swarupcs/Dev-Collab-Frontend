// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  skills: string[];
  role: 'USER' | 'ADMIN';
  visibility: 'PUBLIC' | 'PRIVATE';
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Project Types
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  openRoles: string[];
  status: ProjectStatus;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  user: string | {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    skills: string[];
  };
  joinedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  techStack: string[];
  openRoles?: string[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  techStack?: string[];
  openRoles?: string[];
  status?: ProjectStatus;
}

export interface CollaborationRequest {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    skills: string[];
  };
}

export interface ProjectInvitation {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

// Connection Types
export interface Connection {
  id: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}
