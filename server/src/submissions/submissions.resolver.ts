import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Submission, SubmissionStatus } from './submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission])
  async submissions(
    @Args('status', { nullable: true }) status?: SubmissionStatus,
  ): Promise<Submission[]> {
    return this.submissionsService.findMany({ status });
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
