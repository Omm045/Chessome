import { Redis } from 'ioredis';
import { ICache } from '@chessome/ports';
import { InfrastructureError } from '@chessome/shared';

export class RedisCache implements ICache {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (e) {
      throw new InfrastructureError(`Redis get failed for key ${key}`, e);
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, data);
      } else {
        await this.redis.set(key, data);
      }
    } catch (e) {
      throw new InfrastructureError(`Redis set failed for key ${key}`, e);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (e) {
      throw new InfrastructureError(`Redis del failed for key ${key}`, e);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.redis.exists(key)) > 0;
    } catch (e) {
      throw new InfrastructureError(`Redis exists failed for key ${key}`, e);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch (e) {
      throw new InfrastructureError(`Redis invalidate failed for pattern ${pattern}`, e);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (e) {
      throw new InfrastructureError(`Redis ttl failed for key ${key}`, e);
    }
  }

  async touch(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.expire(key, ttlSeconds);
    } catch (e) {
      throw new InfrastructureError(`Redis expire failed for key ${key}`, e);
    }
  }
}
