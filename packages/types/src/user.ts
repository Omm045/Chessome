import { BaseEntity } from './common';

export interface User extends BaseEntity {
  email: string;
  username: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  boardStyle: string;
  pieceSet: string;
  defaultEngineDepth: number;
}

export interface UserStats {
  gamesImported: number;
  gamesAnalyzed: number;
  averageAccuracy: number;
}
