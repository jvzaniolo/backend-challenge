import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';
import { SubmissionType } from '../object-types/submission.type';

@Resolver(() => SubmissionType)
export class SubmitChallengeResolver {
  constructor(private readonly submitChallengeUseCase: SubmitChallengeUseCase) {}

  @Mutation(() => SubmissionType)
  async submitChallenge(
    @Args('challengeId') challengeId: string,
    @Args('repositoryUrl') repositoryUrl: string,
  ): Promise<SubmissionType> {
    return this.submitChallengeUseCase.execute({
      challengeId,
      repositoryUrl,
    });
  }
}
