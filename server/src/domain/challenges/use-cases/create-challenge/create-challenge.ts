import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../../repositories/typeorm/challenges.repository';

@Injectable()
export class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengesRepository) {}

  async execute(input: { title: string; description: string }) {
    const challenge = await this.challengeRepository.create(input);
    return { challenge };
  }
}
