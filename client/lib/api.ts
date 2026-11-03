import { EventItem, JoinedEvent, User, EventDetailResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kindredpulse_token');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('kindredpulse_token', token);
  } else {
    localStorage.removeItem('kindredpulse_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  auth: {
    async register(name: string, email: string, photoURL: string, password: string) {
      return request<{ success: boolean; message: string; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, photoURL, password }),
      });
    },

    async login(email: string, password: string) {
      return request<{ success: boolean; message: string; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    async googleLogin(name: string, email: string, photoURL: string) {
      return request<{ success: boolean; message: string; token: string; user: User }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ name, email, photoURL }),
      });
    },

    async getMe() {
      return request<{ success: boolean; user: User }>('/api/auth/me');
    },

    async updateProfile(profileData: { name: string; photoURL?: string; bio?: string; phone?: string }) {
      return request<{ success: boolean; message: string; token: string; user: User }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
  },

  events: {
    async getAll(params: { limit?: number; category?: string; search?: string; upcomingOnly?: boolean } = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.upcomingOnly !== undefined) query.append('upcomingOnly', String(params.upcomingOnly));

      const qs = query.toString();
      return request<{ success: boolean; count: number; events: EventItem[] }>(`/api/events${qs ? `?${qs}` : ''}`);
    },

    async getById(id: string) {
      return request<EventDetailResponse>(`/api/events/${id}`);
    },

    async getUserEvents(email: string) {
      return request<{ success: boolean; count: number; events: EventItem[] }>(`/api/events/user/${encodeURIComponent(email)}`);
    },

    async create(eventData: Omit<EventItem, '_id' | 'organizerEmail' | 'organizerName' | 'createdAt' | 'updatedAt'>) {
      return request<{ success: boolean; message: string; event: EventItem }>('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },

    async update(id: string, eventData: Partial<EventItem>) {
      return request<{ success: boolean; message: string; event: EventItem }>(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
    },

    async delete(id: string) {
      return request<{ success: boolean; message: string }>(`/api/events/${id}`, {
        method: 'DELETE',
      });
    },
  },

  joined: {
    async getAll() {
      return request<{ success: boolean; count: number; events: JoinedEvent[] }>('/api/joined-events');
    },

    async join(eventId: string) {
      return request<{ success: boolean; message: string; joinRecord: JoinedEvent }>('/api/joined-events', {
        method: 'POST',
        body: JSON.stringify({ eventId }),
      });
    },

    async cancel(idOrEventId: string) {
      return request<{ success: boolean; message: string }>(`/api/joined-events/${idOrEventId}`, {
        method: 'DELETE',
      });
    },
  },
};
