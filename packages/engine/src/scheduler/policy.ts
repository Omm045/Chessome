import { ILeasedSession } from '../pool';

export type SchedulerPolicyType = 'FIFO' | 'LIFO' | 'LeastBusy' | 'LeastRecentlyUsed' | 'Weighted' | 'CapabilityAware';

export interface ISchedulerPolicy {
  readonly type: SchedulerPolicyType;
  
  /**
   * Determines which request should be processed next from the queue.
   */
  selectNext<T>(queue: T[]): T | undefined;
  
  /**
   * Evaluates if a session can be preempted.
   */
  canPreempt(session: ILeasedSession): boolean;
}
