import { Query, Resolver } from '@nestjs/graphql';
import { Submission } from './submissions.entity';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor() {}

  @Query(() => [Submission])
  submissions(): Submission[] {
    return [
      {
        id: '1',
        challengeId: '1',
        repositoryUrl: 'url',
        grade: 0,
        status: 'Pending',
        createdAt: new Date(),
      },
    ];
  }
}
