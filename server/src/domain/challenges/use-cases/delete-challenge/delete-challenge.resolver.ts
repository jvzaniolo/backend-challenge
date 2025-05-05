import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Challenge } from '../../entities/challenge.entity';
import { DeleteChallengeUseCase } from './delete-challenge';

@Resolver(() => Challenge)
export class DeleteChallengeResolver {
  constructor(private deleteChallengeUseCase: DeleteChallengeUseCase) {}

  @Mutation(() => Challenge)
  async deleteChallenge(@Args('id') id: string): Promise<Challenge> {
    const { challenge } = await this.deleteChallengeUseCase.execute({ id });
    return challenge;
  }
}
