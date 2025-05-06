import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Challenge } from '~/domain/challenges/entities/challenge.entity';
import { CreateChallengeUseCase } from '~/domain/challenges/use-cases/create-challenge/create-challenge';

@Resolver(() => Challenge)
export class CreateChallengeResolver {
  constructor(private createChallengeUseCase: CreateChallengeUseCase) {}

  @Mutation(() => Challenge)
  async createChallenge(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<Challenge> {
    const { challenge } = await this.createChallengeUseCase.execute({ title, description });
    return challenge;
  }
}
