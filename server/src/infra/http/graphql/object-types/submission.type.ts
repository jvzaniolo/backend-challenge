import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { SubmissionInterface, SubmissionStatus } from '~/domain/submissions/entities/submission';
import { CustomUuidScalar } from '../scalars/uuid.scalar';
import { ChallengeType } from './challenge.type';
import { PaginationType } from './pagination.type';

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
  valuesMap: {
    Pending: {
      description: 'The default status.',
    },
  },
});

@ObjectType('Submission')
export class SubmissionType implements SubmissionInterface {
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
  items: SubmissionType[];

  @Field(() => PaginationType)
  pagination: PaginationType;
}
