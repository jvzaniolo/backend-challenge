import { randomUUID } from 'node:crypto';
import { Challenge } from '../../entities/challenge.entity';

export class FakeChallengesRepository {
  private challenges: Challenge[] = [];

  create(input: { title: string; description: string }): Challenge {
    const challenge = new Challenge();
    challenge.id = randomUUID();
    challenge.title = input.title;
    challenge.description = input.description;
    challenge.createdAt = new Date();
    this.challenges.push(challenge);
    return challenge;
  }

  update(input: { id: string; title?: string; description?: string }): Challenge | null {
    const challenge = this.challenges.find((challenge) => challenge.id === input.id);
    if (!challenge) {
      return null;
    }
    Object.assign(challenge, {
      title: input.title ?? challenge.title,
      description: input.description ?? challenge.description,
    });
    return challenge;
  }

  delete(input: { id: string }): Challenge | null {
    const challengeIndex = this.challenges.findIndex((challenge) => challenge.id === input.id);
    if (challengeIndex === -1) {
      return null;
    }
    const [deletedChallenge] = this.challenges.splice(challengeIndex, 1);
    return deletedChallenge;
  }
}
