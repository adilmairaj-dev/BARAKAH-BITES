import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { api, errMsg } from '../core/api';
import { Restaurant, User } from '../core/models';

export type Role = 'user' | 'restaurant' | null;

interface AuthState {
  role: Role;
  account: User | Restaurant | null;
  loading: boolean;
  error: string | null;
  init: () => Promise<void>;
  register: (d: { name: string; email: string; password: string }) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  loginRestaurant: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setAccount: (a: User | Restaurant) => void;
}

let initPromise: Promise<void> | null = null;

export const authStore = createStore<AuthState>()(
  persist(
    (set, get) => ({
      role: null,
      account: null,
      loading: false,
      error: null,

      init: () => {
        if (!initPromise) {
          initPromise = (async () => {
            const { role } = get();
            if (!role) return;
            try {
              const account = await api<User | Restaurant>(role === 'user' ? '/user/current' : '/restaurant/current');
              set({ account });
            } catch {
              set({ role: null, account: null });
            }
          })();
        }
        return initPromise;
      },

      register: async d => {
        set({ loading: true, error: null });
        try {
          await api('/user/register', { method: 'POST', body: d });
          set({ loading: false });
          return true;
        } catch (e) {
          set({ loading: false, error: errMsg(e) });
          return false;
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api<{ loggedInUser: User }>('/user/login', { method: 'POST', body: { email, password } });
          set({ role: 'user', account: data.loggedInUser, loading: false });
          return true;
        } catch (e) {
          set({ loading: false, error: errMsg(e) });
          return false;
        }
      },

      loginRestaurant: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api<{ loggedInRestaurant: Restaurant }>('/restaurant/login', { method: 'POST', body: { email, password } });
          set({ role: 'restaurant', account: data.loggedInRestaurant, loading: false });
          return true;
        } catch (e) {
          set({ loading: false, error: errMsg(e) });
          return false;
        }
      },

      logout: async () => {
        const { role } = get();
        try { await api(role === 'user' ? '/user/logout' : '/restaurant/logout', { method: 'POST' }); } catch {}
        set({ role: null, account: null });
      },

      clearError: () => set({ error: null }),
      setAccount: account => set({ account }),
    }),
    { name: 'auth', partialize: s => ({ role: s.role }) as Partial<AuthState> as AuthState },
  ),
);
