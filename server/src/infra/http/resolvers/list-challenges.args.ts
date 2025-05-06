import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '~/infra/http/resolvers/args-type/pagination.args';

@ArgsType()
export class ListChallengesArgs extends PaginationArgs {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
