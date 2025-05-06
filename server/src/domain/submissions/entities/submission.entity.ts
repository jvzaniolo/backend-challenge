import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pagination } from '~/common/pagination/pagination.type';
import { CustomUuidScalar } from '~/common/scalar/uuid.scalar';
import { Challenge } from '~/domain/challenges/entities/challenge.entity';

export enum SubmissionStatus {
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
  valuesMap: {
    Pending: {
      description: 'The default status.',
    },
  },
});

@Entity()
@ObjectType()
export class Submission {
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
  grade?: number;

  @Field(() => SubmissionStatus)
  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.Pending })
  status: SubmissionStatus = SubmissionStatus.Pending;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Challenge, { nullable: true })
  @ManyToOne(() => Challenge, (challenge) => challenge.submissions, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'challengeId' })
  challenge?: Challenge | null;
}

@ObjectType()
export class PaginatedSubmissions {
  @Field(() => [Submission])
  items: Submission[];

  @Field(() => Pagination)
  pagination: Pagination;
}
