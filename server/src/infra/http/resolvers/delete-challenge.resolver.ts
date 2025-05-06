import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeleteChallengeUseCase } from '~/domain/challenges/use-cases/delete-challenge/delete-challenge';
import { ChallengeType } from '../object-types/challenge.type';

@Resolver(() => ChallengeType)
export class DeleteChallengeResolver {
  constructor(private deleteChallengeUseCase: DeleteChallengeUseCase) {}

  @Mutation(() => ChallengeType)
  async deleteChallenge(@Args('id') id: string): Promise<ChallengeType> {
    const { challenge } = await this.deleteChallengeUseCase.execute({ id });
    return challenge;
  }
}
