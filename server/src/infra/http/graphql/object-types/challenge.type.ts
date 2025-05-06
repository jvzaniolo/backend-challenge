import { Field, ObjectType } from '@nestjs/graphql';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { Submission } from '~/domain/submissions/entities/submission';
import { PaginationType } from '~/infra/http/object-types/pagination.type';
import { CustomUuidScalar } from '~/infra/http/scalars/uuid.scalar';
import { SubmissionType } from './submission.type';

@ObjectType('Challenge')
export class ChallengeType implements Challenge {
  @Field(() => CustomUuidScalar)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field(() => [SubmissionType], { nullable: true })
  submissions?: Submission[];
}

@ObjectType()
export class PaginatedChallenge {
  @Field(() => [ChallengeType])
  items: Challenge[];

  @Field(() => PaginationType)
  pagination: PaginationType;
}
