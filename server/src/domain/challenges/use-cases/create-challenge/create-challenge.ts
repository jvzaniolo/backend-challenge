import { Injectable } from '@nestjs/common';
import { Challenge } from '../../entities/challenge';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class CreateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengesRepository) {}

  async execute(data: { title: string; description: string }) {
    const challenge = Challenge.create(data);
    await this.challengeRepository.create(challenge);
    return { challenge };
  }
}
