import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pagination } from '~/@core/dto/pagination.type';
import { CustomUuidScalar } from '~/@core/scalar/uuid.scalar';
import { Submission } from '~/submissions/submission.entity';

@Entity()
@ObjectType()
export class Challenge {
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

  @Field(() => [Submission], { nullable: true })
  @OneToMany(() => Submission, (submission) => submission.challenge)
  submissions?: Submission[];
}

@ObjectType()
export class PaginatedChallenge {
  @Field(() => [Challenge])
  items: Challenge[];

  @Field(() => Pagination)
  pagination: Pagination;
}
