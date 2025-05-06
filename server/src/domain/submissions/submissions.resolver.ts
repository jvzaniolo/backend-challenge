import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Submission } from './entities/submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

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
