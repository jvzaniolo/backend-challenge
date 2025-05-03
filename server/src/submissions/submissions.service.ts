import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from 'src/challenges/challenge.entity';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengesRepository: Repository<Challenge>,

    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  findMany(): Promise<Submission[]> {
    return this.submissionsRepository.find();
  }

  async create({
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

    // TODO: Connect to corrections service and update the submission grade and status

    this.submissionsRepository.merge(submission, {
      status: SubmissionStatus.Done,
      grade: 10,
    });

    return this.submissionsRepository.save(submission);
  }
}

function isGithubRepo(url: string): boolean {
  const regex = /^(https?:\/\/)?(www\.)?github\.com\/([^/]+)\/([^/]+)/;
  return regex.test(url);
}
