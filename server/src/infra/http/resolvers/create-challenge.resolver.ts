import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateChallengeUseCase } from '~/domain/challenges/use-cases/create-challenge/create-challenge';
import { GraphQLChallenge } from '~/infra/database/typeorm/entities/challenge.entity';

@Resolver(() => GraphQLChallenge)
export class CreateChallengeResolver {
  constructor(private createChallengeUseCase: CreateChallengeUseCase) {}

  @Mutation(() => GraphQLChallenge)
  async createChallenge(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<GraphQLChallenge> {
    const { challenge } = await this.createChallengeUseCase.execute({ title, description });
    return challenge;
  }
}
