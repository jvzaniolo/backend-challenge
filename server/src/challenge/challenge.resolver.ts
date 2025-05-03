import { Query, Resolver } from '@nestjs/graphql';
import { Challenge } from './challenge.model';
import { ChallengeService } from './challenge.service';

@Resolver(() => Challenge)
export class ChallengeResolver {
  constructor(private challengesService: ChallengeService) {}

  @Query(() => [Challenge])
  async challenges(): Promise<Challenge[]> {
    return this.challengesService.findMany();
  }
}
