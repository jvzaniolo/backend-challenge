import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class UpdateChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengesRepository) {}

  async execute({ id, title, description }: { id: string; title?: string; description?: string }) {
    const challenge = await this.challengeRepository.update(id, {
      title,
      description,
    });
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    return { challenge };
  }
}
