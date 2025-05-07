import { Injectable } from '@nestjs/common';
import { DomainEvents } from '~/core/events/domain-events';
import { ChallengeNotFoundError } from '~/domain/challenges/errors/challenge-not-found';
import { isGithubRepo } from '~/domain/submissions/utils/is-github-repo';
import { ChallengesRepository } from '../../../challenges/repositories/challenges.repository';
import { Submission, SubmissionStatus } from '../../entities/submission';
import { InvalidGitHubURLError } from '../../errors/invalid-github-url';
import { SubmitChallengeEvent } from '../../events/submit-challenge.event';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class SubmitChallengeUseCase {
  constructor(
    private readonly challengesRepository: ChallengesRepository,
    private readonly submissionsRepository: SubmissionsRepository,
  ) {}

  async execute({ challengeId, repositoryUrl }: { challengeId: string; repositoryUrl: string }) {
    const submission = Submission.create({
      challengeId,
      repositoryUrl,
    });
    await this.submissionsRepository.create(submission);

    if (!isGithubRepo(repositoryUrl)) {
      await this.submissionsRepository.update(submission.id, {
        status: SubmissionStatus.Error,
      });
      throw new InvalidGitHubURLError();
    }

    const challenge = await this.challengesRepository.findById(challengeId);

    if (!challenge) {
      await this.submissionsRepository.update(submission.id, {
        status: SubmissionStatus.Error,
      });
      throw new ChallengeNotFoundError();
    }

    DomainEvents.dispatch(
      SubmitChallengeEvent.name,
      new SubmitChallengeEvent({
        challengeId: challenge.id,
        submissionId: submission.id,
      }),
    );

    return { submission };
  }
}
