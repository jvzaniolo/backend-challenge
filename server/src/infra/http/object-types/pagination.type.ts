import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pagination } from '~/core/pagination';

@ObjectType()
export class PaginationType implements Pagination {
  @Field(() => Int, { description: 'Total number of items' })
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int, { description: 'Number of items per page' })
  perPage: number;
}
