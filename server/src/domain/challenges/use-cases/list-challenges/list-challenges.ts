import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class ListChallengesUseCase {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async execute(args: { title?: string; description?: string; page?: number; perPage?: number }) {
    const { items, pagination } = await this.challengesRepository.findMany(args);
    return { items, pagination };
  }
}
