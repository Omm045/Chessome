import { Redis } from 'ioredis';
import { IMessageBus } from '@chessome/core';
import { InfrastructureError } from '@chessome/shared';
import { EventSerializer, IEventPayload } from '@chessome/events';

export class RedisMessageBus implements IMessageBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscriptions = new Map<string, (message: any) => Promise<void>>();
  private isSubscribed = false;

  constructor(
    private readonly publisher: Redis,
    private readonly subscriber: Redis
  ) {}

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
      if (!this.isSubscribed) {
        this.subscriber.on('message', async (channel, message) => {
          const cb = this.subscriptions.get(channel);
          if (cb) {
            try {
              const parsed = EventSerializer.deserialize<IEventPayload>(message);
              await cb(parsed);
            } catch (err) {
              console.error(`Error in message handler for topic ${channel}`, err);
            }
          }
        });
        this.isSubscribed = true;
      }

      await this.subscriber.subscribe(topic);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.subscriptions.set(topic, handler as any);
      
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
    // Redis Pub/Sub doesn't have acks. This is a no-op here, but future NATS/Kafka adapters will use it.
  }
}
