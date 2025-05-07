import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateChallengeUseCase } from '~/domain/challenges/use-cases/update-challenge/update-challenge';
import { ChallengeType } from '../object-types/challenge.type';

@Resolver(() => ChallengeType)
export class UpdateChallengeResolver {
  constructor(private updateChallengeUseCase: UpdateChallengeUseCase) {}

  @Mutation(() => ChallengeType)
  async updateChallenge(
    @Args('id') id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<ChallengeType> {
    const { challenge } = await this.updateChallengeUseCase.execute(id, { title, description });
    return challenge;
  }
}
