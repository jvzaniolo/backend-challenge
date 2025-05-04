import { Inject, Injectable } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { z } from 'zod';
import { Challenge } from '~/challenges/challenge.entity';
import { GetSubmissionArgs } from './dto/get-submissions.args';
import { Submission, SubmissionStatus } from './submission.entity';

const CorrectionResponseSchema = z.object({
  repositoryUrl: z.string(),
  grade: z.number(),
  status: z.nativeEnum(SubmissionStatus),
});

@Injectable()
export class SubmissionsService {
  constructor(
    @Inject('CORRECTIONS_SERVICE')
    private readonly correctionsService: ClientKafkaProxy,

    @InjectRepository(Challenge)
    private readonly challengesRepository: Repository<Challenge>,

    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  findMany({
    page,
    perPage,
    status,
    dateRange,
    challengeTitle,
  }: GetSubmissionArgs): Promise<Submission[]> {
    return this.submissionsRepository.find({
      skip: page ? (page - 1) * perPage : 0,
      take: perPage,
      where: {
        status,
        createdAt: dateRange ? Between(dateRange.startDate, dateRange.endDate) : undefined,
        challenge: {
          title: challengeTitle ? ILike(`%${challengeTitle}%`) : undefined,
        },
      },
      relations: {
        challenge: true,
      },
    });
  }

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

  async submitChallenge({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = await this.create({ challengeId, repositoryUrl });

    let correction: unknown;

    try {
      correction = await new Promise((resolve, reject) => {
        return this.correctionsService
          .send('challenge.correction', {
            submissionId: submission.id,
            repositoryUrl: submission.repositoryUrl,
          })
          .subscribe({
            next: resolve,
            error: reject,
          });
      });
    } catch {
      throw new Error('Error while connecting to the corrections service.');
    }

    const parsedCorrection = CorrectionResponseSchema.safeParse(correction);

    if (!parsedCorrection.success) {
      throw new Error('Invalid response from the corrections service.');
    }

    const { status, grade } = parsedCorrection.data;

    this.submissionsRepository.merge(submission, {
      status,
      grade,
    });

    return this.submissionsRepository.save(submission);
  }
}

function isGithubRepo(url: string): boolean {
  const regex = /^(https?:\/\/)?(www\.)?github\.com\/([^/]+)\/([^/]+)/;
  return regex.test(url);
}
