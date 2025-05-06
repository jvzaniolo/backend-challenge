import { Inject, Injectable } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { DomainEvents } from '~/core/events/domain-events';
import { SubmitChallengeEvent } from '~/domain/submissions/events/submit-challenge.event';

@Injectable()
export class SubmitChallengeSubscriber {
  constructor(
    @Inject('SUBMISSION_KAFKA')
    private readonly submissionKafkaClient: ClientKafkaProxy,
  ) {
    DomainEvents.register(SubmitChallengeEvent.name, this.handleSubmitChallenge.bind(this));
  }

  async handleSubmitChallenge(event: SubmitChallengeEvent) {
    this.submissionKafkaClient
      .send('challenge.correction', {
        submissionId: event.submissionId,
        repositoryUrl: event.repositoryUrl,
      })
      .subscribe();
  }
}
