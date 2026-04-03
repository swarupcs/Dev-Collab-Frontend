// ============================================================
// Mock API Service — Simulates backend calls with delays
// ============================================================

import {
  mockUsers,
  mockProjects,
  mockConnectionRequests,
  mockConversations,
  mockMessages,
  mockNotifications,
  mockActivities,
  trendingSkills,
  type MockUser,
  type Project,
  type ConnectionRequest,
  type ChatMessage,
  type CollaborationRequest,
  type ProjectInvitation,
} from './mockData';

/** Simulate network delay (400–1200ms by default) */
const delay = (ms?: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms ?? 400 + Math.random() * 800),
  );

/** Occasionally simulate failures (5% chance) */
const maybeThrow = () => {
  if (Math.random() < 0.05)
    throw new Error('Network error — please try again.');
};

// ---- Auth ----
export const authApi = {
  /** Sign in with email + password. Returns a mock JWT on success. */
  async signIn(email: string, password: string) {
    await delay();
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error('Invalid email or password.');
    const token = btoa(
      JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }),
    );
    return { user, token };
  },

  /** Sign up a new mock user. */
  async signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await delay();
    if (mockUsers.some((u) => u.email === data.email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: MockUser = {
      id: `u${Date.now()}`,
      ...data,
      avatarUrl: '',
      bio: '',
      location: '',
      website: '',
      github: '',
      twitter: '',
      skills: [],
      joinedDate: new Date().toISOString().split('T')[0],
      isOnline: true,
      visibility: 'public',
    };
    mockUsers.push(newUser);
    const token = btoa(
      JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }),
    );
    return { user: newUser, token };
  },
};

// ---- Users ----
export const usersApi = {
  async getAll() {
    await delay(300);
    return [...mockUsers];
  },

  async getById(id: string) {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found.');
    return { ...user };
  },

  async search(query: string, skillFilter?: string) {
    await delay(400);
    let results = [...mockUsers];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (skillFilter && skillFilter !== 'all') {
      results = results.filter((u) => u.skills.includes(skillFilter));
    }
    return results;
  },

  async updateProfile(userId: string, updates: Partial<MockUser>) {
    await delay(600);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    Object.assign(mockUsers[idx], updates);
    return { ...mockUsers[idx] };
  },
};

// ---- Connections ----
export const connectionsApi = {
  async getForUser(userId: string) {
    await delay(300);
    return mockConnectionRequests.filter(
      (cr) => cr.fromUserId === userId || cr.toUserId === userId,
    );
  },

  async send(fromUserId: string, toUserId: string) {
    await delay(500);
    maybeThrow();
    const req: ConnectionRequest = {
      id: `cr${Date.now()}`,
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockConnectionRequests.push(req);
    return req;
  },

  async accept(requestId: string) {
    await delay(400);
    const req = mockConnectionRequests.find((r) => r.id === requestId);
    if (req) req.status = 'accepted';
    return req;
  },

  async reject(requestId: string) {
    await delay(400);
    const req = mockConnectionRequests.find((r) => r.id === requestId);
    if (req) req.status = 'rejected';
    return req;
  },
};

// ---- Projects ----
export const projectsApi = {
  async getAll() {
    await delay(400);
    return [...mockProjects];
  },

  async getById(id: string) {
    await delay(300);
    const p = mockProjects.find((pr) => pr.id === id);
    if (!p) throw new Error('Project not found.');
    return { ...p };
  },

  async create(
    data: Omit<
      Project,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'applicants'
      | 'status'
      | 'invitations'
      | 'collaborationRequests'
    >,
  ) {
    await delay(600);
    const project: Project = {
      ...data,
      id: `p${Date.now()}`,
      applicants: [],
      invitations: [],
      collaborationRequests: [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    mockProjects.unshift(project);
    return project;
  },

  async update(
    projectId: string,
    updates: Partial<
      Pick<
        Project,
        'title' | 'description' | 'techStack' | 'openRoles' | 'status'
      >
    >,
  ) {
    await delay(500);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (!p) throw new Error('Project not found.');
    Object.assign(p, updates, {
      updatedAt: new Date().toISOString().split('T')[0],
    });
    return { ...p };
  },

  async apply(
    projectId: string,
    userId: string,
    role: string = '',
    message: string = '',
  ) {
    await delay(500);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (p && !p.applicants.includes(userId)) {
      p.applicants.push(userId);
      const collab: CollaborationRequest = {
        id: `collab${Date.now()}`,
        userId,
        projectId,
        role: role || p.openRoles[0] || 'Contributor',
        message: message || 'I would love to contribute to this project!',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      p.collaborationRequests.push(collab);
    }
    return p;
  },

  async acceptCollaboration(projectId: string, collabId: string) {
    await delay(400);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (p) {
      const collab = p.collaborationRequests.find((c) => c.id === collabId);
      if (collab) {
        collab.status = 'accepted';
        if (!p.members.includes(collab.userId)) p.members.push(collab.userId);
        p.applicants = p.applicants.filter((a) => a !== collab.userId);
      }
    }
    return p;
  },

  async rejectCollaboration(projectId: string, collabId: string) {
    await delay(400);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (p) {
      const collab = p.collaborationRequests.find((c) => c.id === collabId);
      if (collab) {
        collab.status = 'rejected';
        p.applicants = p.applicants.filter((a) => a !== collab.userId);
      }
    }
    return p;
  },

  async inviteDeveloper(projectId: string, userId: string, role: string) {
    await delay(500);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (!p) throw new Error('Project not found.');
    const inv: ProjectInvitation = {
      id: `inv${Date.now()}`,
      userId,
      projectId,
      role,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    p.invitations.push(inv);
    return inv;
  },

  async respondToInvitation(
    projectId: string,
    invitationId: string,
    accept: boolean,
  ) {
    await delay(400);
    const p = mockProjects.find((pr) => pr.id === projectId);
    if (p) {
      const inv = p.invitations.find((i) => i.id === invitationId);
      if (inv) {
        inv.status = accept ? 'accepted' : 'declined';
        if (accept && !p.members.includes(inv.userId))
          p.members.push(inv.userId);
      }
    }
    return p;
  },
};

// ---- Chat ----
export const chatApi = {
  async getConversations() {
    await delay(300);
    return [...mockConversations];
  },

  async getMessages(conversationId: string) {
    await delay(400);
    return [...(mockMessages[conversationId] || [])];
  },

  async sendMessage(conversationId: string, senderId: string, message: string) {
    await delay(300);
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      conversationId,
      senderId,
      message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };
    if (!mockMessages[conversationId]) mockMessages[conversationId] = [];
    mockMessages[conversationId].push(newMsg);
    // Update conversation's last message
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = message;
      conv.lastMessageTime = 'Just now';
    }
    return newMsg;
  },

  async addReaction(
    messageId: string,
    conversationId: string,
    emoji: string,
    userId: string,
  ) {
    await delay(200);
    const msgs = mockMessages[conversationId];
    if (msgs) {
      const msg = msgs.find((m) => m.id === messageId);
      if (msg) {
        const existing = msg.reactions.findIndex(
          (r) => r.userId === userId && r.emoji === emoji,
        );
        if (existing >= 0) msg.reactions.splice(existing, 1);
        else msg.reactions.push({ emoji, userId });
      }
    }
  },
};

// ---- Notifications ----
export const notificationsApi = {
  async getAll() {
    await delay(200);
    return [...mockNotifications];
  },

  async markAsRead(id: string) {
    await delay(200);
    const n = mockNotifications.find((n) => n.id === id);
    if (n) n.read = true;
  },

  async markAllAsRead() {
    await delay(200);
    mockNotifications.forEach((n) => (n.read = true));
  },
};

// ---- Activity & Trending ----
export const activityApi = {
  async getAll() {
    await delay(300);
    return [...mockActivities];
  },
};

export const skillsApi = {
  async getTrending() {
    await delay(300);
    return [...trendingSkills];
  },
};
