import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Challenge } from '~/domain/challenges/entities/challenge.entity';
import { UpdateChallengeUseCase } from '~/domain/challenges/use-cases/update-challenge/update-challenge';

@Resolver(() => Challenge)
export class UpdateChallengeResolver {
  constructor(private updateChallengeUseCase: UpdateChallengeUseCase) {}

  @Mutation(() => Challenge)
  async updateChallenge(
    @Args('id') id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Challenge> {
    const { challenge } = await this.updateChallengeUseCase.execute({ id, title, description });
    return challenge;
  }
}
