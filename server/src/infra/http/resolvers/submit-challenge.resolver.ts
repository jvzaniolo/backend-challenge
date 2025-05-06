import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';
import { GraphQLSubmission } from '~/infra/database/typeorm/entities/submission.entity';

@Resolver(() => GraphQLSubmission)
export class SubmitChallengeResolver {
  constructor(private readonly submitChallengeUseCase: SubmitChallengeUseCase) {}

  @Mutation(() => GraphQLSubmission)
  async submitChallenge(
    @Args('challengeId') challengeId: string,
    @Args('repositoryUrl') repositoryUrl: string,
  ): Promise<GraphQLSubmission> {
    return this.submitChallengeUseCase.execute({
      challengeId,
      repositoryUrl,
    });
  }
}
