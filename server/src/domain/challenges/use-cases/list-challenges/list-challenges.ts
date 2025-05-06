import { Injectable } from '@nestjs/common';
import { PaginatedChallenge } from '../../entities/challenge.entity';
import { ChallengesRepository } from '../../repositories/typeorm/challenges.repository';
import { ListChallengesArgs } from './list-challenges.args';

@Injectable()
export class ListChallengesUseCase {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async execute(args: ListChallengesArgs): Promise<PaginatedChallenge> {
    const { items, pagination } = await this.challengesRepository.findMany(args);
    return { items, pagination };
  }
}
