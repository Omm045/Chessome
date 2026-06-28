import { IUnitOfWork, ITransaction, IMessageBus } from '@chessome/core';
import { IEventPayload, EventSerializer } from '@chessome/events';

export interface IOutboxRepository {
  save(tx: ITransaction, eventType: string, payload: unknown): Promise<void>;
  getPendingBatch(limit: number): Promise<Array<{ id: string, eventType: string, payload: unknown }>>;
  markAsPublished(id: string): Promise<void>;
  markAsFailed(id: string): Promise<void>;
}

/**
 * Handles inserting events into the Outbox within a transaction.
 */
export class OutboxPublisher {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly outboxRepo: IOutboxRepository,
    private readonly messageBus: IMessageBus
  ) {}

  /**
   * Publishes an event to the Outbox safely within the provided transaction.
   */
  async publishWithinTransaction<T extends IEventPayload>(tx: ITransaction, eventType: string, event: T): Promise<void> {
    const serializedPayload = EventSerializer.serialize(event);
    await this.outboxRepo.save(tx, eventType, JSON.parse(serializedPayload));
  }

  /**
   * Called by a dedicated Outbox Relay Worker to publish pending events to the actual Message Bus.
   */
  async relayPendingEvents(batchSize: number = 50): Promise<void> {
    const pending = await this.outboxRepo.getPendingBatch(batchSize);
    for (const record of pending) {
      try {
        await this.messageBus.publish(record.eventType, record.payload);
        await this.outboxRepo.markAsPublished(record.id);
      } catch (err) {
        console.error(`Failed to relay outbox event ${record.id}`, err);
        await this.outboxRepo.markAsFailed(record.id);
      }
    }
  }
}
