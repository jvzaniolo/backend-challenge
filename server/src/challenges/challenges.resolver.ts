import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Challenge } from './challenge.entity';
import { ChallengesService } from './challenges.service';

@Resolver(() => Challenge)
export class ChallengesResolver {
  constructor(private challengesService: ChallengesService) {}

  @Query(() => [Challenge])
  async challenges(
    @Args('title', { nullable: true }) title?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page?: number,
    @Args({ name: 'perPage', type: () => Int, nullable: true, description: 'Defaults to 10.' })
    perPage: number = 10,
  ): Promise<Challenge[]> {
    return this.challengesService.findMany({ title, description, page, perPage });
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
