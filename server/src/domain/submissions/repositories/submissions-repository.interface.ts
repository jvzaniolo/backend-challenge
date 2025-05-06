import { Paginated, PaginatedArgs } from '~/core/pagination';
import { Submission } from '../entities/submission';
import { SubmissionStatus } from '../entities/submission.interface';

export abstract class SubmissionsRepository {
  abstract create(args: { challengeId: string; repositoryUrl: string }): Promise<Submission>;
  abstract update(args: {
    id: string;
    status?: SubmissionStatus;
    grade?: number;
  }): Promise<Submission | null>;
  abstract findBy(args: { id: string }): Promise<Submission | null>;
  abstract findMany(
    args: {
      status?: SubmissionStatus;
      dateRange?: { startDate: Date; endDate: Date };
      challengeTitle?: string;
    } & PaginatedArgs,
  ): Promise<Paginated<Submission>>;
}
