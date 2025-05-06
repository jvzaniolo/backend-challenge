import { Inject, Injectable } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isGithubRepo } from '~/common/utils/is-github-repo';
import { Challenge } from '~/domain/challenges/entities/challenge.entity';
import { Submission, SubmissionStatus } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @Inject('SUBMISSION_KAFKA')
    private readonly submissionKafkaClient: ClientKafkaProxy,

    @InjectRepository(Challenge)
    private readonly challengesRepository: Repository<Challenge>,

    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  private async create({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = this.submissionsRepository.create({
      challengeId,
      repositoryUrl,
    });
    await this.submissionsRepository.save(submission);

    if (!isGithubRepo(repositoryUrl)) {
      await this.submissionsRepository.update(submission.id, {
        status: SubmissionStatus.Error,
      });
      throw new Error('Invalid GitHub repository URL.');
    }

    const challenge = await this.challengesRepository.findOneBy({ id: challengeId });

    if (!challenge) {
      await this.submissionsRepository.update(submission.id, {
        status: SubmissionStatus.Error,
      });
      throw new Error('Challenge not found.');
    }

    return submission;
  }

  async update({
    submissionId,
    status,
    grade,
  }: {
    submissionId: string;
    status: SubmissionStatus;
    grade: number;
  }): Promise<Submission | null> {
    const submission = await this.submissionsRepository.findOneBy({ id: submissionId });

    if (!submission) {
      throw new Error('Submission not found.');
    }

    this.submissionsRepository.merge(submission, {
      status,
      grade,
    });

    return this.submissionsRepository.save(submission);
  }

  async submitChallenge({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = await this.create({ challengeId, repositoryUrl });

    this.submissionKafkaClient
      .send('challenge.correction', {
        submissionId: submission.id,
        repositoryUrl: submission.repositoryUrl,
      })
      .subscribe();

    return this.submissionsRepository.save(submission);
  }
}
