import { Module } from '@nestjs/common';
import { ChallengeResolver } from './challenge.resolver';

@Module({
  providers: [ChallengeResolver],
})
export class ChallengeModule {}
