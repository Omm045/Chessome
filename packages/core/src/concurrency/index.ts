export interface IDistributedLock {
  /**
   * Acquires a lock with a specific TTL.
   * @param key The lock key
   * @param ttlSeconds How long the lock should be held automatically
   * @returns true if acquired, false if already locked
   */
  acquire(key: string, ttlSeconds: number): Promise<boolean>;
  
  /**
   * Releases a previously acquired lock.
   */
  release(key: string): Promise<void>;
  
  /**
   * Extends the TTL of a currently held lock.
   */
  extend(key: string, ttlSeconds: number): Promise<boolean>;
}
