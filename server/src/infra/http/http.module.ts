import { Module } from '@nestjs/common';

import { CreateChallengeUseCase } from '~/domain/challenges/use-cases/create-challenge/create-challenge';
import { DeleteChallengeUseCase } from '~/domain/challenges/use-cases/delete-challenge/delete-challenge';
import { ListChallengesUseCase } from '~/domain/challenges/use-cases/list-challenges/list-challenges';
import { UpdateChallengeUseCase } from '~/domain/challenges/use-cases/update-challenge/update-challenge';
import { ListSubmissionsUseCase } from '~/domain/submissions/use-cases/list-submissions/list-submissions';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';
import { UpdateSubmissionUseCase } from '~/domain/submissions/use-cases/update-submission/update-submission';
import { DatabaseModule } from '../database/database.module';
import { CreateChallengeResolver } from './graphql/resolvers/create-challenge.resolver';
import { DeleteChallengeResolver } from './graphql/resolvers/delete-challenge.resolver';
import { ListChallengesResolver } from './graphql/resolvers/list-challenges.resolver';
import { ListSubmissionsResolver } from './graphql/resolvers/list-submissions.resolver';
import { SubmitChallengeResolver } from './graphql/resolvers/submit-challenge.resolver';
import { UpdateChallengeResolver } from './graphql/resolvers/update-challenge.resolver';
import { UpdateSubmissionController } from './rest/controllers/update-submission.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UpdateSubmissionController],
  providers: [
    CreateChallengeUseCase,
    CreateChallengeResolver,

    UpdateChallengeUseCase,
    UpdateChallengeResolver,

    DeleteChallengeUseCase,
    DeleteChallengeResolver,

    ListChallengesUseCase,
    ListChallengesResolver,

    SubmitChallengeUseCase,
    SubmitChallengeResolver,

    ListSubmissionsUseCase,
    ListSubmissionsResolver,

    UpdateSubmissionUseCase,
  ],
})
export class HttpModule {}
