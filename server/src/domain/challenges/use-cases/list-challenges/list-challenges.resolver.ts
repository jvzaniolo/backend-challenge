import { Args, Query, Resolver } from '@nestjs/graphql';
import { Challenge, PaginatedChallenge } from '../../entities/challenge.entity';
import { ListChallengesUseCase } from './list-challenges';
import { ListChallengesArgs } from './list-challenges.args';

@Resolver(() => Challenge)
export class ListChallengesResolver {
  constructor(private listChallengesUseCase: ListChallengesUseCase) {}

  @Query(() => PaginatedChallenge)
  async challenges(@Args() filters: ListChallengesArgs): Promise<PaginatedChallenge> {
    return this.listChallengesUseCase.execute(filters);
  }
}
