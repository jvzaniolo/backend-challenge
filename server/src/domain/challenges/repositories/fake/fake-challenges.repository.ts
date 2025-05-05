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
}
