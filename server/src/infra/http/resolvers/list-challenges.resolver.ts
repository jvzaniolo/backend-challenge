import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListChallengesUseCase } from '~/domain/challenges/use-cases/list-challenges/list-challenges';
import {
  GraphQLChallenge,
  PaginatedChallenge,
} from '~/infra/database/typeorm/entities/challenge.entity';
import { ListChallengesArgs } from './list-challenges.args';

@Resolver(() => GraphQLChallenge)
export class ListChallengesResolver {
  constructor(private listChallengesUseCase: ListChallengesUseCase) {}

  @Query(() => PaginatedChallenge)
  async challenges(@Args() filters: ListChallengesArgs): Promise<PaginatedChallenge> {
    return this.listChallengesUseCase.execute(filters);
  }
}
