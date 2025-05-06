import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginatedSubmissions, Submission } from '../../entities/submission.entity';
import { ListSubmissionsUseCase } from './list-submissions';
import { ListSubmissionsArgs } from './list-submissions.args';

@Resolver(() => Submission)
export class ListSubmissionsResolver {
  constructor(private readonly listSubmissionsUseCase: ListSubmissionsUseCase) {}

  @Query(() => PaginatedSubmissions)
  async submissions(@Args() filters: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    return this.listSubmissionsUseCase.execute(filters);
  }
}
