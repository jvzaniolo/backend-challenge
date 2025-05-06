import { PaginatedSubmissions } from '../entities/submission.entity';
import { ListSubmissionsArgs } from '../use-cases/list-submissions/list-submissions.args';

export interface SubmissionsRepositoryInterface {
  findMany(args: ListSubmissionsArgs): Promise<PaginatedSubmissions>;
}
