import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { SubmissionStatus } from '~/domain/submissions/entities/submission.interface';
import { SubmissionsRepository } from '~/domain/submissions/repositories/submissions-repository.interface';
import {
  GraphQLSubmission,
  PaginatedSubmissions,
} from '~/infra/database/typeorm/entities/submission.entity';

@Injectable()
export class TypeORMSubmissionsRepository implements SubmissionsRepository {
  constructor(
    @InjectRepository(GraphQLSubmission)
    private readonly submissionRepository: Repository<GraphQLSubmission>,
  ) {}

  async create({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<GraphQLSubmission> {
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
  }): Promise<GraphQLSubmission | null> {
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

  async findBy({ id }: { id: string }): Promise<GraphQLSubmission | null> {
    return this.submissionRepository.findOne({
      where: { id },
      relations: {
        challenge: true,
      },
    });
  }

  async findMany({
    page,
    perPage,
    status,
    dateRange,
    challengeTitle,
  }: {
    page?: number;
    perPage: number;
    status?: SubmissionStatus;
    dateRange?: { startDate: Date; endDate: Date };
    challengeTitle?: string;
  }): Promise<PaginatedSubmissions> {
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
