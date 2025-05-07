import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ChallengesRepository } from '~/domain/challenges/repositories/challenges.repository';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';
import { ChallengeType } from '../object-types/challenge.type';
import { SubmissionType } from '../object-types/submission.type';

@Resolver(() => SubmissionType)
export class SubmitChallengeResolver {
  constructor(
    private readonly submitChallengeUseCase: SubmitChallengeUseCase,
    private readonly challengesRepository: ChallengesRepository,
  ) {}

  @Mutation(() => SubmissionType)
  async submitChallenge(
    @Args('challengeId') challengeId: string,
    @Args('repositoryUrl') repositoryUrl: string,
  ): Promise<SubmissionType> {
    const { submission } = await this.submitChallengeUseCase.execute({
      challengeId,
      repositoryUrl,
    });
    return submission;
  }

  @ResolveField(() => ChallengeType)
  async challenge(@Parent() submission: SubmissionType) {
    return this.challengesRepository.findById(submission.challengeId);
  }
}
