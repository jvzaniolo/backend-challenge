import { Challenge } from '../entities/challenge';

export abstract class ChallengesRepository {
  abstract create(input: { title: string; description: string }): Promise<Challenge>;
  abstract update(input: {
    id: string;
    title?: string;
    description?: string;
  }): Promise<Challenge | null>;
  abstract delete(input: { id: string }): Promise<Challenge | null>;
  abstract findBy(args: { id: string }): Promise<Challenge | null>;
  abstract findMany(args: {
    perPage?: number;
    page?: number;
    title?: string;
    description?: string;
  }): Promise<{
    items: Challenge[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
    };
  }>;
}
