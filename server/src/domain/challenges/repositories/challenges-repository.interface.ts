import { Challenge, PaginatedChallenge } from '../entities/challenge.entity';

export interface ChallengesRepositoryInterface {
  create(input: { title: string; description: string }): Promise<Challenge>;
  update(input: { id: string; title?: string; description?: string }): Promise<Challenge | null>;
  delete(input: { id: string }): Promise<Challenge | null>;
  findMany(args: {
    perPage?: number;
    page?: number;
    title?: string;
    description?: string;
  }): Promise<PaginatedChallenge>;
}
