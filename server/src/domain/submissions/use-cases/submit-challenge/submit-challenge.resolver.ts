import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Submission } from '../../entities/submission.entity';
import { SubmitChallengeUseCase } from './submit-challenge';

@Resolver(() => Submission)
export class SubmitChallengeResolver {
  constructor(private readonly submitChallengeUseCase: SubmitChallengeUseCase) {}

  @Mutation(() => Submission)
  async submitChallenge(
    @Args('challengeId') challengeId: string,
    @Args('repositoryUrl') repositoryUrl: string,
  ): Promise<Submission> {
    return this.submitChallengeUseCase.execute({
      challengeId,
      repositoryUrl,
    });
  }
}
