import { Inject, Injectable } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { isGithubRepo } from '~/common/utils/is-github-repo';
import { ChallengesRepository } from '../../../challenges/repositories/challenges.repository';
import { Submission, SubmissionStatus } from '../../entities/submission.entity';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class SubmitChallengeUseCase {
  constructor(
    @Inject('SUBMISSION_KAFKA')
    private readonly submissionKafkaClient: ClientKafkaProxy,

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

    this.submissionKafkaClient
      .send('challenge.correction', {
        submissionId: submission.id,
        repositoryUrl: submission.repositoryUrl,
      })
      .subscribe();

    return submission;
  }
}
