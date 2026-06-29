export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  invalidate(pattern: string): Promise<void>;
  ttl(key: string): Promise<number>;
  touch(key: string, ttlSeconds: number): Promise<void>;
}

export enum CacheInvalidationPolicy {
  NEVER_EXPIRES = 'NEVER_EXPIRES',
  TTL = 'TTL',
  REPLACE = 'REPLACE',
  VERSIONED = 'VERSIONED'
}

