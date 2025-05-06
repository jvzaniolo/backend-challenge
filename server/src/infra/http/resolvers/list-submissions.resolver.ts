import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListSubmissionsUseCase } from '~/domain/submissions/use-cases/list-submissions/list-submissions';
import { PaginatedSubmissions, SubmissionType } from '../object-types/submission.type';
import { ListSubmissionsArgs } from './args-type/list-submissions.args';

@Resolver(() => SubmissionType)
export class ListSubmissionsResolver {
  constructor(private readonly listSubmissionsUseCase: ListSubmissionsUseCase) {}

  @Query(() => PaginatedSubmissions)
  async submissions(@Args() filters: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    return this.listSubmissionsUseCase.execute(filters);
  }
}
