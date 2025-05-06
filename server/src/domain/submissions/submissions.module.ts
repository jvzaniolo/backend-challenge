import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionsRepository } from './repositories/typeorm/submissions.repository';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';
import { ListSubmissionsUseCase } from './use-cases/list-submissions/list-submissions';
import { ListSubmissionsResolver } from './use-cases/list-submissions/list-submissions.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, Submission]),
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

    SubmissionsResolver,
    SubmissionsService,
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
