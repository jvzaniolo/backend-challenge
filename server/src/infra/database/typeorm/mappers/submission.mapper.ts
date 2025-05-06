import { Submission } from '~/domain/submissions/entities/submission';
import { SubmissionSchema } from '../schema/submission.schema';

export class SubmissionMapper {
  static toDomain(entity: SubmissionSchema): Submission {
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

  static toDatabase(domain: Submission): SubmissionSchema {
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
