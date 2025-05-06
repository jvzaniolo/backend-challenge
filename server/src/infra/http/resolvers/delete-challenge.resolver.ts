import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeleteChallengeUseCase } from '~/domain/challenges/use-cases/delete-challenge/delete-challenge';
import { GraphQLChallenge } from '~/infra/database/typeorm/entities/challenge.entity';

@Resolver(() => GraphQLChallenge)
export class DeleteChallengeResolver {
  constructor(private deleteChallengeUseCase: DeleteChallengeUseCase) {}

  @Mutation(() => GraphQLChallenge)
  async deleteChallenge(@Args('id') id: string): Promise<GraphQLChallenge> {
    const { challenge } = await this.deleteChallengeUseCase.execute({ id });
    return challenge;
  }
}
