import { IMessageBus } from '@chessome/ports';

export class MessageBusContract {
  constructor(private readonly bus: IMessageBus) {}

  async testPublishAndSubscribe(): Promise<boolean> {
    const topic = 'contract.test.topic';
    let received = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subId = await this.bus.subscribe(topic, async (msg: any) => {
      if (msg.eventId === '123') {
        received = true;
      }
    });

    await this.bus.publish(topic, { 
      eventId: '123',
      eventVersion: 1,
      schemaVersion: 1,
      occurredAt: new Date().toISOString(),
      producer: 'test',
      correlationId: 'corr-123'
    });
    
    // Wait briefly for delivery
    await new Promise(resolve => setTimeout(resolve, 50));

    await this.bus.unsubscribe(subId);

    if (!received) {
      throw new Error('Message was not received by subscriber');
    }

    return true;
  }
}
