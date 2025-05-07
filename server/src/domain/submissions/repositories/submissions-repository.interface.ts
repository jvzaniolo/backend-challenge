import { Paginated, PaginatedArgs } from '~/core/pagination';
import { Submission, SubmissionStatus } from '../entities/submission';

export abstract class SubmissionsRepository {
  abstract create(submission: Submission): Promise<void>;
  abstract update(id: string, submission: Partial<Submission>): Promise<Submission | null>;
  abstract findById(id: string): Promise<Submission | null>;
  abstract findMany(
    args: {
      status?: SubmissionStatus;
      dateRange?: { startDate: Date; endDate: Date };
      challengeTitle?: string;
    } & PaginatedArgs,
  ): Promise<Paginated<Submission>>;
}
