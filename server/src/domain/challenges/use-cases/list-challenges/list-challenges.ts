import { Injectable } from '@nestjs/common';
import { ListChallengesArgs } from '../../../../infra/http/resolvers/list-challenges.args';
import { PaginatedChallenge } from '../../entities/challenge.entity';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class ListChallengesUseCase {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async execute(args: ListChallengesArgs): Promise<PaginatedChallenge> {
    const { items, pagination } = await this.challengesRepository.findMany(args);
    return { items, pagination };
  }
}
