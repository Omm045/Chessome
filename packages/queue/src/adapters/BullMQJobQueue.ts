import { Queue } from 'bullmq';
import { IJobQueue, JobConfig, IJobEnvelope } from '@chessome/core';
import { InfrastructureError } from '@chessome/shared';

export class BullMQJobQueue<T extends IJobEnvelope> implements IJobQueue<T> {
  constructor(private readonly queue: Queue<T>) {}

  async enqueue(envelope: T, config?: JobConfig): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const job = await this.queue.add('job' as any, envelope as any, {
        attempts: config?.retries || 3,
        backoff: config?.backoff ? {
          type: config.backoff.type,
          delay: config.backoff.delayMs
        } : undefined,
        priority: config?.priority,
      });
      if (!job.id) throw new Error('BullMQ failed to return a Job ID');
      return job.id;
    } catch (e) {
      throw new InfrastructureError('Failed to enqueue job', e);
    }
  }

  async dequeue(): Promise<T | null> {
    throw new InfrastructureError('Manual dequeue is not typically supported by BullMQ without Worker');
  }

  async retry(jobId: string): Promise<void> {
    try {
      const job = await this.queue.getJob(jobId);
      if (job) {
        await job.retry();
      }
    } catch (e) {
      throw new InfrastructureError(`Failed to retry job ${jobId}`, e);
    }
  }

  async cancel(jobId: string): Promise<void> {
    try {
      const job = await this.queue.getJob(jobId);
      if (job) {
        await job.remove();
      }
    } catch (e) {
      throw new InfrastructureError(`Failed to cancel job ${jobId}`, e);
    }
  }

  async delay(envelope: T, delayMs: number, config?: JobConfig): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const job = await this.queue.add('job' as any, envelope as any, {
        delay: delayMs,
        attempts: config?.retries || 3,
        priority: config?.priority,
      });
      if (!job.id) throw new Error('BullMQ failed to return a Job ID');
      return job.id;
    } catch (e) {
      throw new InfrastructureError('Failed to enqueue delayed job', e);
    }
  }
}
