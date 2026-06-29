import { Redis } from 'ioredis';
import { IMessageBus } from '@chessome/ports';
import { InfrastructureError } from '@chessome/shared';
import { EventSerializer, IEventPayload } from '@chessome/events';

export class RedisMessageBus implements IMessageBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscriptions = new Map<string, Set<(message: any) => Promise<void>>>();

  constructor(
    private readonly publisher: Redis,
    private readonly subscriber: Redis
  ) {
    this.subscriber.on('message', async (channel, message) => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        try {
          const parsed = EventSerializer.deserialize<IEventPayload>(message);
          const promises = Array.from(handlers).map(cb => cb(parsed).catch(err => {
            console.error(`Error in message handler for topic ${channel}`, err);
          }));
          await Promise.all(promises);
        } catch (err) {
          console.error(`Error deserializing message for topic ${channel}`, err);
        }
      }
    });
  }

  async publish<T>(topic: string, message: T): Promise<void> {
    try {
      const payload = EventSerializer.serialize(message as unknown as IEventPayload);
      await this.publisher.publish(topic, payload);
    } catch (e) {
      throw new InfrastructureError(`Failed to publish to topic ${topic}`, e);
    }
  }

  async subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<string> {
    try {
      await this.subscriber.subscribe(topic);
      
      let handlers = this.subscriptions.get(topic);
      if (!handlers) {
        handlers = new Set();
        this.subscriptions.set(topic, handlers);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handlers.add(handler as any);
      
      return topic; // using topic as subscription ID for simplicity in this adapter
    } catch (e) {
      throw new InfrastructureError(`Failed to subscribe to topic ${topic}`, e);
    }
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(subscriptionId);
      this.subscriptions.delete(subscriptionId);
    } catch (e) {
      throw new InfrastructureError(`Failed to unsubscribe from ${subscriptionId}`, e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ack(_messageId: string): Promise<void> {
    /**
     * @note Redis Pub/Sub doesn't have native acknowledgements.
     * This implementation provides AT-MOST-ONCE delivery.
     * For AT-LEAST-ONCE delivery, consider migrating to Redis Streams (XADD/XREAD).
     */
  }
}
