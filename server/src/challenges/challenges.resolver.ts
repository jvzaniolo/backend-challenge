import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Challenge } from './challenge.entity';
import { ChallengesService } from './challenges.service';
import { GetChallengesArgs } from './dto/get-challenges.args';

@Resolver(() => Challenge)
export class ChallengesResolver {
  constructor(private challengesService: ChallengesService) {}

  @Query(() => [Challenge])
  async challenges(@Args() filters: GetChallengesArgs): Promise<Challenge[]> {
    return this.challengesService.findMany(filters);
  }

  @Mutation(() => Challenge)
  async createChallenge(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<Challenge> {
    return this.challengesService.create({ title, description });
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
