import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListChallengesUseCase } from '~/domain/challenges/use-cases/list-challenges/list-challenges';
import { ChallengeType, PaginatedChallenge } from '../object-types/challenge.type';
import { ListChallengesArgs } from './list-challenges.args';

@Resolver(() => ChallengeType)
export class ListChallengesResolver {
  constructor(private listChallengesUseCase: ListChallengesUseCase) {}

  @Query(() => PaginatedChallenge)
  async challenges(@Args() filters: ListChallengesArgs): Promise<PaginatedChallenge> {
    return this.listChallengesUseCase.execute(filters);
  }
}
