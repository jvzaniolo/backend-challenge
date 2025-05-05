import { randomUUID } from 'node:crypto';
import { Challenge } from '../../entities/challenge.entity';
import { ChallengesRepositoryInterface } from '../challenges-repository.interface';

export class FakeChallengesRepository implements ChallengesRepositoryInterface {
  private challenges: Challenge[] = [];

  async create(input: { title: string; description: string }): Promise<Challenge> {
    const challenge = new Challenge();
    challenge.id = randomUUID();
    challenge.title = input.title;
    challenge.description = input.description;
    challenge.createdAt = new Date();
    this.challenges.push(challenge);
    return challenge;
  }

  async update(input: {
    id: string;
    title?: string;
    description?: string;
  }): Promise<Challenge | null> {
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

  async delete(input: { id: string }): Promise<Challenge | null> {
    const challengeIndex = this.challenges.findIndex((challenge) => challenge.id === input.id);
    if (challengeIndex === -1) {
      return null;
    }
    const [deletedChallenge] = this.challenges.splice(challengeIndex, 1);
    return deletedChallenge;
  }

  async findMany({
    page,
    perPage,
    title,
    description,
  }: {
    page?: number;
    perPage: number;
    title?: string;
    description?: string;
  }) {
    const filteredChallenges = this.challenges.filter((challenge) => {
      return (
        (!title || challenge.title.includes(title)) &&
        (!description || challenge.description.includes(description))
      );
    });
    const paginatedChallenges = filteredChallenges.slice(
      (page ? page - 1 : 0) * perPage,
      (page ? page - 1 : 0) * perPage + perPage,
    );
    return {
      items: paginatedChallenges,
      pagination: {
        total: filteredChallenges.length,
        page: page || 1,
        perPage,
      },
    };
  }
}
