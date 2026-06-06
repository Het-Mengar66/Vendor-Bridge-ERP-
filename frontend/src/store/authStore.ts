import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

export type AppUserRole = 'admin' | 'procurement_officer' | 'vendor' | 'manager';

export interface AppUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AppUserRole;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setSession: (session: Session | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, isLoading: false }),
  clearAuth: () => set({ user: null, session: null, isLoading: false }),
}));
