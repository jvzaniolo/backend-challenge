import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetSubmissionArgs } from './dto/get-submissions.args';
import { PaginatedSubmissions, Submission } from './submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => PaginatedSubmissions)
  async submissions(@Args() filters: GetSubmissionArgs): Promise<PaginatedSubmissions> {
    return this.submissionsService.findMany(filters);
  }

  @Mutation(() => Submission)
  async submitChallenge(
    @Args('challengeId') challengeId: string,
    @Args('repositoryUrl') repositoryUrl: string,
  ): Promise<Submission> {
    return this.submissionsService.submitChallenge({
      challengeId,
      repositoryUrl,
    });
  }
}
