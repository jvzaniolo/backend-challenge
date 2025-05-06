import { Challenge } from '~/domain/challenges/entities/challenge';
import { ChallengeSchema } from '../schema/challenge.schema';

export class ChallengeMapper {
  static toDomain(entity: ChallengeSchema): Challenge {
    return Challenge.create({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
      submissions: entity.submissions,
    });
  }

  static toDatabase(domain: Challenge): ChallengeSchema {
    const entity = new ChallengeSchema();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.createdAt = domain.createdAt;
    entity.submissions = domain.submissions;
    return entity;
  }
}
