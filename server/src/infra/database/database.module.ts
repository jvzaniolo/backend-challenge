import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesRepository } from '~/domain/challenges/repositories/challenges.repository';
import { SubmissionsRepository } from '~/domain/submissions/repositories/submissions-repository.interface';
import { GraphQLChallenge } from './typeorm/entities/challenge.entity';
import { GraphQLSubmission } from './typeorm/entities/submission.entity';
import { TypeORMChallengesRepository } from './typeorm/repositories/challenges.repository';
import { TypeORMSubmissionsRepository } from './typeorm/repositories/submissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GraphQLSubmission, GraphQLChallenge])],
  providers: [
    {
      provide: ChallengesRepository,
      useClass: TypeORMChallengesRepository,
    },
    {
      provide: SubmissionsRepository,
      useClass: TypeORMSubmissionsRepository,
    },
  ],
  exports: [ChallengesRepository, SubmissionsRepository],
})
export class DatabaseModule {}
