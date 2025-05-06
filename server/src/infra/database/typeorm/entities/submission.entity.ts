import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pagination } from '~/core/pagination/pagination.type';
import { CustomUuidScalar } from '~/core/scalar/uuid.scalar';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { Submission } from '~/domain/submissions/entities/submission';
import {
  SubmissionInterface,
  SubmissionStatus,
} from '~/domain/submissions/entities/submission.interface';
import { GraphQLChallenge } from './challenge.entity';

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
  valuesMap: {
    Pending: {
      description: 'The default status.',
    },
  },
});

@Entity('submission')
@ObjectType('Submission')
export class GraphQLSubmission implements SubmissionInterface {
  @Field(() => CustomUuidScalar)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => CustomUuidScalar)
  @Column()
  challengeId: string;

  @Field()
  @Column()
  repositoryUrl: string;

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true, type: 'float' })
  grade?: number | null;

  @Field(() => SubmissionStatus)
  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.Pending })
  status: SubmissionStatus = SubmissionStatus.Pending;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => GraphQLChallenge, { nullable: true })
  @ManyToOne(() => GraphQLChallenge, (challenge) => challenge.submissions, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'challengeId' })
  challenge?: Challenge | null;
}

@ObjectType()
export class PaginatedSubmissions {
  @Field(() => [GraphQLSubmission])
  items: Submission[];

  @Field(() => Pagination)
  pagination: Pagination;
}
