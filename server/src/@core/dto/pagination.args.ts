import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true, description: 'Defaults to 10.' })
  perPage: number = 10;
}
