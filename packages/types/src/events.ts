export interface DomainEvent<T = unknown> {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  payload: T;
  version: number;
}


