import { create } from 'zustand';
import { UserRole, UserStatus, AuthProvider, Theme, BoardTheme, EvalDisplay } from '@chessome/core';

export interface UserDTO {
  id: string;
  authProvider: AuthProvider;
  authProviderId: string;
  email: string | null;
  emailVerified: boolean;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  preferences: {
    preferencesVersion: number;
    theme: Theme;
    boardTheme: BoardTheme;
    pieceTheme: string;
    engineDepth: number;
    multiPv: number;
    preferredEngine: string;
    evalDisplay: EvalDisplay;
    animationSpeed: string;
    keyboardShortcuts: boolean;
  } | null;
}

interface AuthState {
  user: UserDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserDTO | null) => void;
  setLoading: (loading: boolean) => void;
  updatePreferences: (updates: Partial<UserDTO['preferences']>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  updatePreferences: async (updates) => {
    const { user } = get();
    if (!user || !user.preferences) return;

    // Optimistic update
    const previousUser = { ...user };
    set({
      user: {
        ...user,
        preferences: { ...user.preferences, ...updates },
      },
    });

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/users/me/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences on server');
      }
      
      const updatedUser = await response.json();
      set({ user: updatedUser }); // sync with server
    } catch (error) {
      console.error('Failed to update preferences:', error);
      set({ user: previousUser }); // rollback
    }
  }
}));
