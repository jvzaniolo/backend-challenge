import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListSubmissionsUseCase } from '~/domain/submissions/use-cases/list-submissions/list-submissions';
import {
  GraphQLSubmission,
  PaginatedSubmissions,
} from '~/infra/database/typeorm/entities/submission.entity';
import { ListSubmissionsArgs } from './list-submissions.args';

@Resolver(() => GraphQLSubmission)
export class ListSubmissionsResolver {
  constructor(private readonly listSubmissionsUseCase: ListSubmissionsUseCase) {}

  @Query(() => PaginatedSubmissions)
  async submissions(@Args() filters: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    return this.listSubmissionsUseCase.execute(filters);
  }
}
