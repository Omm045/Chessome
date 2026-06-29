export interface IMessageBus {
  publish<T>(topic: string, message: T): Promise<void>;
  subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<string>; // returns subscription ID
  unsubscribe(subscriptionId: string): Promise<void>;
  ack(messageId: string): Promise<void>;
}
