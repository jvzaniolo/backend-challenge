import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Challenge } from '~/domain/challenges/entities/challenge';
import { Submission } from '~/domain/submissions/entities/submission';
import { SubmissionStatus } from '~/domain/submissions/entities/submission.interface';
import { PaginationType } from '~/infra/http/object-types/pagination.type';
import { CustomUuidScalar } from '~/infra/http/scalars/uuid.scalar';
import { ChallengeType } from './challenge.type';

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
  valuesMap: {
    Pending: {
      description: 'The default status.',
    },
  },
});

@ObjectType('Submission')
export class SubmissionType implements Submission {
  @Field(() => CustomUuidScalar)
  id: string;

  @Field(() => CustomUuidScalar)
  challengeId: string;

  @Field()
  repositoryUrl: string;

  @Field(() => Float, { nullable: true })
  grade?: number | null;

  @Field(() => SubmissionStatus)
  status: SubmissionStatus = SubmissionStatus.Pending;

  @Field()
  createdAt: Date;

  @Field(() => ChallengeType, { nullable: true })
  challenge?: Challenge | null;
}

@ObjectType()
export class PaginatedSubmissions {
  @Field(() => [SubmissionType])
  items: Submission[];

  @Field(() => PaginationType)
  pagination: PaginationType;
}
