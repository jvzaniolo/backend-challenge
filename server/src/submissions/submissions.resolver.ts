import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DateRangeArgs } from './dto/date-range.args';
import { Submission, SubmissionStatus } from './submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission])
  async submissions(
    @Args('status', { nullable: true }) status?: SubmissionStatus,
    @Args('dateRange', { nullable: true, type: () => DateRangeArgs }) dateRange?: DateRangeArgs,
  ): Promise<Submission[]> {
    return this.submissionsService.findMany({ status, dateRange });
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
