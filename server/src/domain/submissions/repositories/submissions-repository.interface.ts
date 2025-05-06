import { PaginatedSubmissions, Submission, SubmissionStatus } from '../entities/submission.entity';
import { ListSubmissionsArgs } from '../use-cases/list-submissions/list-submissions.args';

export interface SubmissionsRepositoryInterface {
  create(args: { challengeId: string; repositoryUrl: string }): Promise<Submission>;
  update(args: {
    id: string;
    status?: SubmissionStatus;
    grade?: number;
  }): Promise<Submission | null>;
  findBy(args: { id: string }): Promise<Submission | null>;
  findMany(args: ListSubmissionsArgs): Promise<PaginatedSubmissions>;
}
