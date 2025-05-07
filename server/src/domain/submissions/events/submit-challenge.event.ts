import { DomainEvent } from '~/core/events/domain-events';

export class SubmitChallengeEvent implements DomainEvent {
  occurredOn: Date;

  constructor(public data: { challengeId: string; submissionId: string }) {
    this.occurredOn = new Date();
  }
}
