export class Time {
  static now(): Date {
    return new Date();
  }

  static nowTimestamp(): number {
    return Date.now();
  }

  static fromTimestamp(timestamp: number): Date {
    return new Date(timestamp);
  }
}
