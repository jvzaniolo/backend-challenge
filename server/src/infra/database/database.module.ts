import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '~/domain/challenges/entities/challenge.entity';
import { ChallengesRepository } from '~/domain/challenges/repositories/challenges.repository';
import { Submission } from '~/domain/submissions/entities/submission.entity';
import { SubmissionsRepository } from '~/domain/submissions/repositories/submissions-repository.interface';
import { TypeORMChallengesRepository } from './typeorm/challenges.repository';
import { TypeORMSubmissionsRepository } from './typeorm/submissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Challenge])],
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
