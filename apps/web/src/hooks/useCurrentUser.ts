import { useAuthStore } from '@/store/useAuthStore';

export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return { user, isAuthenticated, isLoading };
}
