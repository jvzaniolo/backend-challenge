import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChallengesService } from './challenges.service';
import { GetChallengesArgs } from './dto/get-challenges.args';
import { Challenge, PaginatedChallenge } from './entities/challenge.entity';

@Resolver(() => Challenge)
export class ChallengesResolver {
  constructor(private challengesService: ChallengesService) {}

  @Query(() => PaginatedChallenge)
  async challenges(@Args() filters: GetChallengesArgs): Promise<PaginatedChallenge> {
    return this.challengesService.findMany(filters);
  }

  @Mutation(() => Challenge)
  async deleteChallenge(@Args('id') id: string): Promise<Challenge> {
    return this.challengesService.delete(id);
  }
}
