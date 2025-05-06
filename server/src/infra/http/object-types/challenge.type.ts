import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from '~/core/pagination/pagination.type';
import { CustomUuidScalar } from '~/core/scalar/uuid.scalar';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { Submission } from '~/domain/submissions/entities/submission';
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

  @Field(() => Pagination)
  pagination: Pagination;
}
