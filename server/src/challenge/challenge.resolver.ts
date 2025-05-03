import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Challenge } from './challenge.model';
import { ChallengeService } from './challenge.service';

@Resolver(() => Challenge)
export class ChallengeResolver {
  constructor(private challengesService: ChallengeService) {}

  @Query(() => [Challenge])
  async challenges(): Promise<Challenge[]> {
    return this.challengesService.findMany();
  }

  @Mutation(() => Challenge)
  async createChallenge(
    @Args('title') title: string,
    @Args('description') description: string,
  ): Promise<Challenge> {
    return this.challengesService.create({ title, description });
  }
}
