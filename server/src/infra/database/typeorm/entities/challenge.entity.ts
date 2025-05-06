import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pagination } from '~/core/pagination/pagination.type';
import { CustomUuidScalar } from '~/core/scalar/uuid.scalar';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { ChallengeInterface } from '~/domain/challenges/entities/challenge.interface';
import { Submission } from '~/domain/submissions/entities/submission';
import { GraphQLSubmission } from './submission.entity';

@Entity('challenge')
@ObjectType('Challenge')
export class GraphQLChallenge implements ChallengeInterface {
  @Field(() => CustomUuidScalar)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [GraphQLSubmission], { nullable: true })
  @OneToMany(() => GraphQLSubmission, (submission) => submission.challenge)
  submissions?: Submission[];
}

@ObjectType()
export class PaginatedChallenge {
  @Field(() => [GraphQLChallenge])
  items: Challenge[];

  @Field(() => Pagination)
  pagination: Pagination;
}
