import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateChallengeUseCase } from '~/domain/challenges/use-cases/update-challenge/update-challenge';
import { GraphQLChallenge } from '~/infra/database/typeorm/entities/challenge.entity';

@Resolver(() => GraphQLChallenge)
export class UpdateChallengeResolver {
  constructor(private updateChallengeUseCase: UpdateChallengeUseCase) {}

  @Mutation(() => GraphQLChallenge)
  async updateChallenge(
    @Args('id') id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<GraphQLChallenge> {
    const { challenge } = await this.updateChallengeUseCase.execute({ id, title, description });
    return challenge;
  }
}
