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
  // Joined Game Data
  white: string;
  black: string;
  result: string;
  date: Date;
  eco: string | null;
  opening: string | null;
  moveCount: number;
}

export interface LibraryQueryParams {
  userId: string;
  folder?: 'recent' | 'favorites' | 'archived' | 'trash';
  collectionId?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLibraryResult {
  data: LibrarySessionView[];
  total: number;
  page: number;
  limit: number;
}

export interface ILibraryQueryService {
  querySessions(params: LibraryQueryParams): Promise<PaginatedLibraryResult>;
}
