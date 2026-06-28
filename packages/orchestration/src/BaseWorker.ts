import { IJobEnvelope, IDistributedLock } from '@chessome/core';
import { BaseHandler } from './BaseHandler';

export interface WorkerContext {
  workerName: string;
  maxConcurrency: number;
}

export abstract class BaseWorker<TRequest, TResponse> {
  constructor(
    protected readonly context: WorkerContext,
    protected readonly handler: BaseHandler<TRequest, TResponse>,
    protected readonly lock?: IDistributedLock
  ) {}

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  /**
   * The core orchestrator method that every worker delegates to when a job is pulled from the queue.
   * Enforces observability, idempotency checks (if applicable here or in handler), and smart retries.
   */
  protected async processJob(envelope: IJobEnvelope<TRequest>): Promise<void> {
    const startTime = Date.now();
    try {
      this.emit('Started', envelope);

      if (this.lock && envelope.deduplicationKey) {
        const acquired = await this.lock.acquire(envelope.deduplicationKey, 300); // 5 min TTL Default
        if (!acquired) {
          this.emit('IdempotencyConflict', envelope);
          // If already locked, depending on use case we might skip or retry. We skip as deduplicated.
          return;
        }
      }

      if (this.handler.preProcess) {
        await this.handler.preProcess(envelope.payload);
      }

      const result = await this.handler.handle(envelope.payload);

      if (this.handler.postProcess) {
        await this.handler.postProcess(envelope.payload, result);
      }

      this.emit('Completed', envelope, Date.now() - startTime);
    } catch (error) {
      this.emit('Failed', envelope, error);
      if (this.handler.onError) {
        await this.handler.onError(envelope.payload, error as Error);
      }
      throw error; // Let the underlying Queue adapter (BullMQ) handle retry/DLQ based on JobConfig
    } finally {
      if (this.lock && envelope.deduplicationKey) {
        await this.lock.release(envelope.deduplicationKey);
      }
    }
  }

  // Very basic observability simulation. In reality, this delegates to a Logger / Metrics service.
  protected emit(event: string, envelope: IJobEnvelope<unknown>, data?: unknown): void {
    console.log(`[Worker:${this.context.workerName}] [${event}] JobId=${envelope.jobId}`, data ? data : '');
  }
}
