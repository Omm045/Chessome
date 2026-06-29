import { ICache } from '@chessome/ports';

export class CacheContract {
  constructor(private readonly cache: ICache) {}

  async testSetAndGet(): Promise<boolean> {
    const key = 'contract:test:1';
    const value = { hello: 'world' };

    await this.cache.set(key, value);
    const retrieved = await this.cache.get<{ hello: string }>(key);
    
    if (!retrieved || retrieved.hello !== 'world') {
      throw new Error('Cache get did not match set');
    }
    
    await this.cache.delete(key);
    const deleted = await this.cache.get(key);
    
    if (deleted !== null) {
      throw new Error('Cache delete failed');
    }

    return true;
  }
}
