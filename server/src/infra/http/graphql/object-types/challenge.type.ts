import { Field, ObjectType } from '@nestjs/graphql';
import { ChallengeInterface } from '~/domain/challenges/entities/challenge';
import { Submission } from '~/domain/submissions/entities/submission';
import { CustomUuidScalar } from '../scalars/uuid.scalar';
import { PaginationType } from './pagination.type';
import { SubmissionType } from './submission.type';

@ObjectType('Challenge')
export class ChallengeType implements ChallengeInterface {
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
  items: ChallengeType[];

  @Field(() => PaginationType)
  pagination: PaginationType;
}
