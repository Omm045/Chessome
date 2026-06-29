import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
export interface LibrarySessionView {
  id: string;
  gameId: string;
  title: string | null;
  category: string;
  isShared: boolean;
  analysisType: string;
  engineVersion: string;
  engineDepth: number;
  status: string;
  accuracy: number | null;
  lastOpened: Date;
  lastViewedAt: Date;
  viewCount: number;
  isFavorite: boolean;
  tags: string[];
  notes: string | null;
  collection: string | null;
  isArchived: boolean;
  isTrash: boolean;
  createdAt: Date;
  updatedAt: Date;
  white: string;
  black: string;
  result: string;
  date: Date;
  eco: string | null;
  opening: string | null;
  moveCount: number;
}

export interface PaginatedLibraryResult {
  data: LibrarySessionView[];
  total: number;
  page: number;
  limit: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${session.access_token}`);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'API Error');
  }
  return res.json();
}

export function useLibrary(folder: string = 'recent', query: string = '', page: number = 1, limit: number = 20) {
  return useQuery<PaginatedLibraryResult>({
    queryKey: ['library', folder, query, page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (folder) searchParams.set('folder', folder);
      if (query) searchParams.set('q', query);
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      
      return fetchWithAuth(`${API_URL}/v1/library/sessions?${searchParams.toString()}`);
    }
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Record<string, unknown> }) => {
      return fetchWithAuth(`${API_URL}/v1/library/sessions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    }
  });
}

export function useTrashSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return fetchWithAuth(`${API_URL}/v1/library/sessions/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
    }
  });
}
