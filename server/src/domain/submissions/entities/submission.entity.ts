import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Pagination } from '~/common/pagination/pagination.type';
import { CustomUuidScalar } from '~/common/scalar/uuid.scalar';

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
  grade?: number | null;

  @Field(() => SubmissionStatus)
  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.Pending })
  status: SubmissionStatus = SubmissionStatus.Pending;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}

@ObjectType()
export class PaginatedSubmissions {
  @Field(() => [Submission])
  items: Submission[];

  @Field(() => Pagination)
  pagination: Pagination;
}
