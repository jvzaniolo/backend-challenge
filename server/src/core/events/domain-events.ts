export interface DomainEvent {
  occurredOn: Date;
}

export class DomainEvents {
  private static handlers: { [eventName: string]: Array<(event: DomainEvent) => void> } = {};

  static register(eventName: string, handler: (event: DomainEvent) => void): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  static dispatch(eventName: string, event: DomainEvent): void {
    const handlers = this.handlers[eventName] || [];
    handlers.forEach((handler) => handler(event));
  }
}
