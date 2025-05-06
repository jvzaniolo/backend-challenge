import { Submission } from '~/domain/submissions/entities/submission';
import { GraphQLSubmission } from '../entities/submission.entity';

export class SubmissionMapper {
  static toDomain(entity: GraphQLSubmission): Submission {
    return {
      id: entity.id,
      challengeId: entity.challengeId,
      repositoryUrl: entity.repositoryUrl,
      status: entity.status,
      grade: entity.grade,
      challenge: entity.challenge,
      createdAt: entity.createdAt,
    };
  }

  static toDatabase(domain: Submission): GraphQLSubmission {
    return {
      id: domain.id,
      challengeId: domain.challengeId,
      repositoryUrl: domain.repositoryUrl,
      status: domain.status,
      grade: domain.grade,
      challenge: domain.challenge,
      createdAt: domain.createdAt,
    };
  }
}
