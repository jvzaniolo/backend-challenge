import { PaginatedSubmissions, Submission, SubmissionStatus } from '../entities/submission.entity';

export abstract class SubmissionsRepository {
  abstract create(args: { challengeId: string; repositoryUrl: string }): Promise<Submission>;
  abstract update(args: {
    id: string;
    status?: SubmissionStatus;
    grade?: number;
  }): Promise<Submission | null>;
  abstract findBy(args: { id: string }): Promise<Submission | null>;
  abstract findMany(args: {
    page?: number;
    perPage: number;
    status?: SubmissionStatus;
    dateRange?: { startDate: Date; endDate: Date };
    challengeTitle?: string;
  }): Promise<PaginatedSubmissions>;
}
