import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginatedSubmissions, Submission } from '~/domain/submissions/entities/submission.entity';
import { ListSubmissionsUseCase } from '~/domain/submissions/use-cases/list-submissions/list-submissions';
import { ListSubmissionsArgs } from './list-submissions.args';

@Resolver(() => Submission)
export class ListSubmissionsResolver {
  constructor(private readonly listSubmissionsUseCase: ListSubmissionsUseCase) {}

  @Query(() => PaginatedSubmissions)
  async submissions(@Args() filters: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    return this.listSubmissionsUseCase.execute(filters);
  }
}
