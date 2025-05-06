import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesModule } from '../challenges/challenges.module';
import { Submission } from './entities/submission.entity';
import { SubmissionsRepository } from './repositories/typeorm/submissions.repository';
import { ListSubmissionsUseCase } from './use-cases/list-submissions/list-submissions';
import { ListSubmissionsResolver } from './use-cases/list-submissions/list-submissions.resolver';
import { SubmitChallengeUseCase } from './use-cases/submit-challenge/submit-challenge';
import { SubmitChallengeResolver } from './use-cases/submit-challenge/submit-challenge.resolver';
import { UpdateSubmissionUseCase } from './use-cases/update-submission/update-submission';
import { UpdateSubmissionController } from './use-cases/update-submission/update-submission.controller';

@Module({
  imports: [
    ChallengesModule,
    TypeOrmModule.forFeature([Submission]),
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
  providers: [
    SubmissionsRepository,

    ListSubmissionsUseCase,
    ListSubmissionsResolver,

    SubmitChallengeUseCase,
    SubmitChallengeResolver,

    UpdateSubmissionUseCase,
  ],
  controllers: [UpdateSubmissionController],
})
export class SubmissionsModule implements OnModuleInit, OnModuleDestroy {
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
