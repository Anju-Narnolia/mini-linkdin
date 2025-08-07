import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  posts?: Array<{
    _id: string;
    text: string;
  }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  
  login: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      set({ user: data.user, token: data.token, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }

      return { success: true };
    } catch (error: unknown) {
      set({ loading: false });
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ loading: true });
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      set({ user: data.user, token: data.token, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }

      return { success: true };
      } catch (error: unknown) {
      set({ loading: false });
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  logout: () => {
    set({ token: null, user: null, loading: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, token });
      } else {
        // Token is invalid, clear it
        set({ token: null, user: null });
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ token: null, user: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  },

  setUser: (user: User) => set({ user }),
}));