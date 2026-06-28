import { IJobQueue } from '@chessome/core';

export class QueueContract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly queue: IJobQueue<any>) {}

  async testEnqueueAndCancel(): Promise<boolean> {
    const payload = { data: 'test' };
    const jobId = await this.queue.enqueue(payload, {
      retries: 1,
      backoff: { type: 'fixed', delayMs: 1000 },
      timeoutMs: 5000,
      priority: 1
    });

    if (!jobId) {
      throw new Error('Enqueue did not return a job ID');
    }

    await this.queue.cancel(jobId);

    return true;
  }
}
