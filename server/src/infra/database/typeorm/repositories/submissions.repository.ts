import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Submission, SubmissionStatus } from '~/domain/submissions/entities/submission';
import { SubmissionsRepository } from '~/domain/submissions/repositories/submissions-repository.interface';
import { SubmissionMapper } from '../mappers/submission.mapper';
import { SubmissionSchema } from '../schema/submission.schema';

@Injectable()
export class TypeORMSubmissionsRepository implements SubmissionsRepository {
  constructor(
    @InjectRepository(SubmissionSchema)
    private readonly submissionRepository: Repository<SubmissionSchema>,
  ) {}

  async create(submission: Submission) {
    const data = this.submissionRepository.create(SubmissionMapper.toDatabase(submission));
    await this.submissionRepository.save(data);
  }

  async update(id: string, input: Partial<Submission>) {
    const submission = await this.submissionRepository.findOneBy({ id });

    if (!submission) {
      return null;
    }

    this.submissionRepository.merge(submission, input);

    const updatedSubmission = await this.submissionRepository.save(submission);
    return SubmissionMapper.toDomain(updatedSubmission);
  }

  async findById(id: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: {
        challenge: true,
      },
    });
    if (!submission) {
      return null;
    }
    return SubmissionMapper.toDomain(submission);
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
  }) {
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
      items: items.map(SubmissionMapper.toDomain),
      pagination: {
        page: page || 1,
        perPage,
        total: count,
      },
    };
  }
}
