import { Module } from '@nestjs/common';
import { ChallengesModule } from './challenges/challenges.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [ChallengesModule, SubmissionsModule],
})
export class DomainModule {}
