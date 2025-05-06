import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionsRepository } from './repositories/typeorm/submissions.repository';
import { SubmissionsController } from './submissions.controller';
import { ListSubmissionsUseCase } from './use-cases/list-submissions/list-submissions';
import { ListSubmissionsResolver } from './use-cases/list-submissions/list-submissions.resolver';
import { SubmitChallengeUseCase } from './use-cases/submit-challenge/submit-challenge';
import { SubmitChallengeResolver } from './use-cases/submit-challenge/submit-challenge.resolver';

@Module({
  imports: [
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
  controllers: [SubmissionsController],
  providers: [
    SubmissionsRepository,

    ListSubmissionsUseCase,
    ListSubmissionsResolver,

    SubmitChallengeUseCase,
    SubmitChallengeResolver,
  ],
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
