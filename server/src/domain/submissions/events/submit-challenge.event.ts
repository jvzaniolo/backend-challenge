import { DomainEvent } from '~/@core/events/domain-events';

export class SubmitChallengeEvent implements DomainEvent {
  occurredOn: Date;
  eventName: string;
  submissionId: string;
  repositoryUrl: string;

  constructor(submissionId: string, repositoryUrl: string) {
    this.occurredOn = new Date();
    this.eventName = SubmitChallengeEvent.name;
    this.submissionId = submissionId;
    this.repositoryUrl = repositoryUrl;
  }
}
