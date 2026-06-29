export interface JobConfig {
  readonly retries: number;
  readonly backoff: {
    readonly type: 'fixed' | 'exponential';
    readonly delayMs: number;
  };
  readonly jitter?: boolean;
  readonly timeoutMs: number;
  readonly priority: number;
}

export interface IJobEnvelope<T = unknown> {
  readonly jobId: string; // Used for deduplication in queue
  readonly correlationId: string; // Traces entire request flow
  readonly causationId?: string; // ID of event/job that triggered this
  readonly deduplicationKey: string; // Business logic dedup key
  readonly attempt: number; // Incrementing attempt counter
  readonly payload: T;
}

export interface IJobQueue<TEnvelope extends IJobEnvelope> {
  enqueue(envelope: TEnvelope, config?: JobConfig): Promise<string>;
  dequeue(): Promise<TEnvelope | null>;
  retry(jobId: string): Promise<void>;
  cancel(jobId: string): Promise<void>;
  delay(envelope: TEnvelope, delayMs: number, config?: JobConfig): Promise<string>;
}
