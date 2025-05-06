import { Submission } from '~/domain/submissions/entities/submission';
import { SubmissionSchema } from '../schema/submission.schema';

export class SubmissionMapper {
  static toDomain(entity: SubmissionSchema) {
    return Submission.create({
      id: entity.id,
      challengeId: entity.challengeId,
      repositoryUrl: entity.repositoryUrl,
      status: entity.status,
      grade: entity.grade,
      challenge: entity.challenge,
      createdAt: entity.createdAt,
    });
  }

  static toDatabase(domain: Submission) {
    const entity = new SubmissionSchema();
    entity.id = domain.id;
    entity.challengeId = domain.challengeId;
    entity.repositoryUrl = domain.repositoryUrl;
    entity.status = domain.status;
    entity.grade = domain.grade;
    entity.challenge = domain.challenge;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
