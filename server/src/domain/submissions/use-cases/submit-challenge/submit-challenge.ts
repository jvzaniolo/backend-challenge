import { Injectable } from '@nestjs/common';
import { DomainEvents } from '~/core/events/domain-events';
import { isGithubRepo } from '~/domain/submissions/utils/is-github-repo';
import { ChallengesRepository } from '../../../challenges/repositories/challenges.repository';
import { Submission, SubmissionStatus } from '../../entities/submission.entity';
import { SubmitChallengeEvent } from '../../events/submit-challenge.event';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class SubmitChallengeUseCase {
  constructor(
    private readonly challengesRepository: ChallengesRepository,

    private readonly submissionsRepository: SubmissionsRepository,
  ) {}

  async execute({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = await this.submissionsRepository.create({
      challengeId,
      repositoryUrl,
    });

    if (!isGithubRepo(repositoryUrl)) {
      await this.submissionsRepository.update({
        id: submission.id,
        status: SubmissionStatus.Error,
      });
      throw new Error('Invalid GitHub repository URL.');
    }

    const challenge = await this.challengesRepository.findBy({ id: challengeId });

    if (!challenge) {
      await this.submissionsRepository.update({
        id: submission.id,
        status: SubmissionStatus.Error,
      });
      throw new Error('Challenge not found.');
    }

    DomainEvents.dispatch(new SubmitChallengeEvent(submission.id, submission.repositoryUrl));

    return submission;
  }
}
