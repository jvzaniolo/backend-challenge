import { Injectable } from '@nestjs/common';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found';
import { ChallengesRepository } from '../../repositories/challenges.repository';

@Injectable()
export class DeleteChallengeUseCase {
  constructor(private readonly challengeRepository: ChallengesRepository) {}

  async execute(input: { id: string }) {
    const challenge = await this.challengeRepository.delete(input.id);
    if (!challenge) {
      throw new ChallengeNotFoundError();
    }
    return { challenge };
  }
}
