import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Submission } from './submission.entity';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';

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
  providers: [SubmissionsResolver, SubmissionsService],
})
export class SubmissionsModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('SUBMISSION_KAFKA')
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    // await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
