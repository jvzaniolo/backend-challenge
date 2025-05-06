import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field(() => Int, { description: 'Total number of items' })
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int, { description: 'Number of items per page' })
  perPage: number;
}
