import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
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
}
