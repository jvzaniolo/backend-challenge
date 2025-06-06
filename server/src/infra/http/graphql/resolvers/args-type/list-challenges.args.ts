import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from './pagination.args';

@ArgsType()
export class ListChallengesArgs extends PaginationArgs {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
