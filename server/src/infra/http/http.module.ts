import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { CreateChallengeUseCase } from '~/domain/challenges/use-cases/create-challenge/create-challenge';
import { DeleteChallengeUseCase } from '~/domain/challenges/use-cases/delete-challenge/delete-challenge';
import { ListChallengesUseCase } from '~/domain/challenges/use-cases/list-challenges/list-challenges';
import { UpdateChallengeUseCase } from '~/domain/challenges/use-cases/update-challenge/update-challenge';
import { ListSubmissionsUseCase } from '~/domain/submissions/use-cases/list-submissions/list-submissions';
import { SubmitChallengeUseCase } from '~/domain/submissions/use-cases/submit-challenge/submit-challenge';
import { UpdateSubmissionUseCase } from '~/domain/submissions/use-cases/update-submission/update-submission';
import { DatabaseModule } from '../database/database.module';
import { UpdateSubmissionController } from './controllers/update-submission.controller';
import { CreateChallengeResolver } from './resolvers/create-challenge.resolver';
import { DeleteChallengeResolver } from './resolvers/delete-challenge.resolver';
import { ListChallengesResolver } from './resolvers/list-challenges.resolver';
import { ListSubmissionsResolver } from './resolvers/list-submissions.resolver';
import { SubmitChallengeResolver } from './resolvers/submit-challenge.resolver';
import { UpdateChallengeResolver } from './resolvers/update-challenge.resolver';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'SUBMISSION_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'submission-consumer',
          },
        },
      },
    ]),
  ],
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
export class HttpModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('SUBMISSION_KAFKA')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
