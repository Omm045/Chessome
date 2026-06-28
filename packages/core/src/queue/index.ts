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

export interface IJobQueue<TPayload> {
  enqueue(payload: TPayload, config?: JobConfig): Promise<string>;
  dequeue(): Promise<{ jobId: string, payload: TPayload } | null>;
  retry(jobId: string): Promise<void>;
  cancel(jobId: string): Promise<void>;
  delay(payload: TPayload, delayMs: number, config?: JobConfig): Promise<string>;
}
