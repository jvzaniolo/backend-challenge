import { Paginated, PaginatedArgs } from '~/core/pagination';
import { Challenge } from '../entities/challenge';

export abstract class ChallengesRepository {
  abstract create(challenge: Challenge): Promise<Challenge>;
  abstract update(id: string, challenge: Partial<Challenge>): Promise<Challenge | null>;
  abstract delete(id: string): Promise<Challenge | null>;
  abstract findById(id: string): Promise<Challenge | null>;
  abstract findMany(
    args: {
      title?: string;
      description?: string;
    } & PaginatedArgs,
  ): Promise<Paginated<Challenge>>;
}
