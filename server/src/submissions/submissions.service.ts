import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { isGithubRepo } from '~/@core/utils/is-github-repo';
import { Challenge } from '~/challenges/challenge.entity';
import { CorrectionsService } from '~/corrections/corrections.service';
import { GetSubmissionArgs } from './dto/get-submissions.args';
import { Submission, SubmissionStatus } from './submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly correctionsService: CorrectionsService,

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
    const correction = await this.correctionsService.send({
      submissionId: submission.id,
      repositoryUrl: submission.repositoryUrl,
    });

    this.submissionsRepository.merge(submission, {
      status: correction.status,
      grade: correction.grade,
    });

    return this.submissionsRepository.save(submission);
  }
}
