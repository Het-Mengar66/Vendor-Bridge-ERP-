export type UserRole = 'admin' | 'procurement_officer' | 'vendor' | 'manager';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  country?: string;
  avatar_url?: string;
  is_active: boolean;
  supabase_uid?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}
