import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Submission } from '~/domain/submissions/entities/submission.entity';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';

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
