import { Challenge } from '../../entities/challenge';
import { ChallengesRepository } from '../challenges.repository';

export class FakeChallengesRepository implements ChallengesRepository {
  private challenges: Challenge[] = [];

  async create(challenge: Challenge) {
    this.challenges.push(challenge);
    return challenge;
  }

  async update(challenge: Challenge) {
    const challengeIndex = this.challenges.findIndex((item) => item.id === challenge.id);

    if (challengeIndex === -1) {
      return null;
    }

    this.challenges[challengeIndex] = {
      ...this.challenges[challengeIndex],
      ...challenge,
    } as Challenge;

    return this.challenges[challengeIndex];
  }

  async delete(id: string) {
    const challengeIndex = this.challenges.findIndex((item) => item.id === id);
    if (challengeIndex === -1) {
      return null;
    }
    const [deletedChallenge] = this.challenges.splice(challengeIndex, 1);
    return deletedChallenge;
  }

  async findById(id: string) {
    return this.challenges.find((challenge) => challenge.id === id) || null;
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
