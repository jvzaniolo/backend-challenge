import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafkaProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { CorrectionsService } from './corrections.service';

@Module({
  imports: [
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
  providers: [CorrectionsService],
  exports: [CorrectionsService],
})
export class CorrectionsModule implements OnModuleInit, OnModuleDestroy {
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
