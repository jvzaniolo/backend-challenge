import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ChallengesRepository } from './repositories/typeorm/challenges.repository';
import { CreateChallengeUseCase } from './use-cases/create-challenge/create-challenge';
import { CreateChallengeResolver } from './use-cases/create-challenge/create-challenge.resolver';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge/delete-challenge';
import { DeleteChallengeResolver } from './use-cases/delete-challenge/delete-challenge.resolver';
import { ListChallengesUseCase } from './use-cases/list-challenges/list-challenges';
import { ListChallengesResolver } from './use-cases/list-challenges/list-challenges.resolver';
import { UpdateChallengeUseCase } from './use-cases/update-challenge/update-challenge';
import { UpdateChallengeResolver } from './use-cases/update-challenge/update-challenge.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])],
  providers: [
    ChallengesRepository,

    CreateChallengeUseCase,
    CreateChallengeResolver,

    UpdateChallengeUseCase,
    UpdateChallengeResolver,

    DeleteChallengeUseCase,
    DeleteChallengeResolver,

    ListChallengesUseCase,
    ListChallengesResolver,
  ],
  exports: [ChallengesRepository],
})
export class ChallengesModule {}
