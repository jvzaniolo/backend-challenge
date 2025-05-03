import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafkaProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from 'src/challenges/challenge.entity';
import { Submission } from './submission.entity';
import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, Submission]),
    ClientsModule.register([
      {
        name: 'CORRECTIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'challenge-consumer',
          },
        },
      },
    ]),
  ],
  providers: [SubmissionsResolver, SubmissionsService],
})
export class SubmissionsModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('CORRECTIONS_SERVICE')
    private readonly client: ClientKafkaProxy,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }
}
