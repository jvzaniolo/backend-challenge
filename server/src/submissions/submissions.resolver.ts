import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetSubmissionArgs } from './dto/get-submissions.args';
import { Submission } from './submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission])
  async submissions(@Args() filters: GetSubmissionArgs): Promise<Submission[]> {
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
