import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Pagination } from '~/common/pagination/pagination.type';
import { CustomUuidScalar } from '~/common/scalar/uuid.scalar';

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
}

@ObjectType()
export class PaginatedChallenge {
  @Field(() => [Challenge])
  items: Challenge[];

  @Field(() => Pagination)
  pagination: Pagination;
}
