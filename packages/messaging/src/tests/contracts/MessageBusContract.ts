import { IMessageBus } from '@chessome/core';

export class MessageBusContract {
  constructor(private readonly bus: IMessageBus) {}

  async testPublishAndSubscribe(): Promise<boolean> {
    const topic = 'contract.test.topic';
    let received = false;

    const subId = await this.bus.subscribe(topic, async (msg: any) => {
      if (msg.eventId === '123') {
        received = true;
      }
    });

    await this.bus.publish(topic, { eventId: '123', timestamp: Date.now(), version: 1 });
    
    // Wait briefly for delivery
    await new Promise(resolve => setTimeout(resolve, 50));

    await this.bus.unsubscribe(subId);

    if (!received) {
      throw new Error('Message was not received by subscriber');
    }

    return true;
  }
}
