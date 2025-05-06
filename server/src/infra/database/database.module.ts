import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesRepository } from '~/domain/challenges/repositories/challenges.repository';
import { SubmissionsRepository } from '~/domain/submissions/repositories/submissions-repository.interface';
import { TypeORMChallengesRepository } from './typeorm/repositories/challenges.repository';
import { TypeORMSubmissionsRepository } from './typeorm/repositories/submissions.repository';
import { ChallengeSchema } from './typeorm/schema/challenge.schema';
import { SubmissionSchema } from './typeorm/schema/submission.schema';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionSchema, ChallengeSchema])],
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
