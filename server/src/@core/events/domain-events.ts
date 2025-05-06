export interface DomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class DomainEvents {
  private static handlers: { [eventName: string]: Array<(event: DomainEvent) => void> } = {};

  static register(eventName: string, handler: (event: DomainEvent) => void): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  static dispatch(event: DomainEvent): void {
    const handlers = this.handlers[event.eventName] || [];
    handlers.forEach((handler) => handler(event));
  }
}
