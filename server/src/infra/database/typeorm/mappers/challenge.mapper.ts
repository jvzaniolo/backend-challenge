import { Challenge } from '~/domain/challenges/entities/challenge';
import { GraphQLChallenge } from '../entities/challenge.entity';

export class ChallengeMapper {
  static toDomain(entity: GraphQLChallenge): Challenge {
    return Challenge.create({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
      submissions: entity.submissions,
    });
  }

  static toDatabase(domain: Challenge): GraphQLChallenge {
    const entity = new GraphQLChallenge();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.createdAt = domain.createdAt;
    entity.submissions = domain.submissions;
    return entity;
  }
}
