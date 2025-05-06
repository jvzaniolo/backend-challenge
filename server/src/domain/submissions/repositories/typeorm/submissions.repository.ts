import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import {
  PaginatedSubmissions,
  Submission,
  SubmissionStatus,
} from '../../entities/submission.entity';
import { ListSubmissionsArgs } from '../../use-cases/list-submissions/list-submissions.args';
import { SubmissionsRepositoryInterface } from '../submissions-repository.interface';

@Injectable()
export class SubmissionsRepository implements SubmissionsRepositoryInterface {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  async create({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = this.submissionRepository.create({
      challengeId,
      repositoryUrl,
    });

    return this.submissionRepository.save(submission);
  }

  async update({
    id,
    status,
    grade,
  }: {
    id: string;
    status?: SubmissionStatus;
    grade?: number;
  }): Promise<Submission | null> {
    const submission = await this.submissionRepository.findOneBy({ id });

    if (!submission) {
      return null;
    }

    this.submissionRepository.merge(submission, {
      status,
      grade,
    });

    return this.submissionRepository.save(submission);
  }

  async findMany({
    page,
    perPage,
    status,
    dateRange,
    challengeTitle,
  }: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    const [items, count] = await this.submissionRepository.findAndCount({
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

    return {
      items,
      pagination: {
        page: page || 1,
        perPage,
        total: count,
      },
    };
  }
}
