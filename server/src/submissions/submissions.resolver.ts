import { Query, Resolver } from '@nestjs/graphql';
import { Submission } from './submission.entity';
import { SubmissionsService } from './submissions.service';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission])
  async submissions(): Promise<Submission[]> {
    return this.submissionsService.findMany();
  }
}
