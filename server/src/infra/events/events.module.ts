import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { SubmitChallengeSubscriber } from './submit-challenge/submit-challenge.subscriber';

@Module({
  imports: [
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
  providers: [SubmitChallengeSubscriber],
})
export class EventsModule implements OnModuleInit, OnModuleDestroy {
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
