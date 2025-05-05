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
  async updateChallenge(
    @Args('id') id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<Challenge> {
    return this.challengesService.update(id, { title, description });
  }

  @Mutation(() => Challenge)
  async deleteChallenge(@Args('id') id: string): Promise<Challenge> {
    return this.challengesService.delete(id);
  }
}
