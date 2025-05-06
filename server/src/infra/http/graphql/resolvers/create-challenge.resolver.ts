import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateChallengeUseCase } from '~/domain/challenges/use-cases/create-challenge/create-challenge';
import { ChallengeType } from '../object-types/challenge.type';

@Resolver(() => ChallengeType)
export class CreateChallengeResolver {
  constructor(private createChallengeUseCase: CreateChallengeUseCase) {}

  @Mutation(() => ChallengeType)
  async createChallenge(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<ChallengeType> {
    const { challenge } = await this.createChallengeUseCase.execute({ title, description });
    return challenge;
  }
}
