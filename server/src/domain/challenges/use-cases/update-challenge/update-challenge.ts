import { Injectable } from '@nestjs/common';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengesRepository) {}

  async execute(id: string, input: { title?: string; description?: string }) {
    const challenge = await this.challengeRepository.update(id, input);
    if (!challenge) {
      throw new ChallengeNotFoundError();
    }
    return { challenge };
  }
}
