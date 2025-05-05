import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesResolver } from './challenges.resolver';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/challenge.entity';
import { CreateChallengeUseCase } from './use-cases/create-challenge/create-challenge';
import { CreateChallengeResolver } from './use-cases/create-challenge/create-challenge.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])],
  providers: [
    CreateChallengeUseCase,
    CreateChallengeResolver,
    ChallengesResolver,
    ChallengesService,
  ],
})
export class ChallengesModule {}
