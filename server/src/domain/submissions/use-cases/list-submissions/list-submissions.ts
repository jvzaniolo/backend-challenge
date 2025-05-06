import { Injectable } from '@nestjs/common';
import { PaginatedSubmissions, SubmissionStatus } from '../../entities/submission.entity';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class ListSubmissionsUseCase {
  constructor(private readonly submissionsRepository: SubmissionsRepository) {}

  async execute(args: {
    page?: number;
    perPage: number;
    status?: SubmissionStatus;
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
    challengeTitle?: string;
  }): Promise<PaginatedSubmissions> {
    const { items, pagination } = await this.submissionsRepository.findMany(args);
    return { items, pagination };
  }
}
