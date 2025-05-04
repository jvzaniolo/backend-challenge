import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '~/challenges/challenge.entity';
import { CorrectionsModule } from '~/corrections/corrections.module';
import { Submission } from './submission.entity';
import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Submission]), CorrectionsModule],
  providers: [SubmissionsResolver, SubmissionsService],
})
export class SubmissionsModule {}
