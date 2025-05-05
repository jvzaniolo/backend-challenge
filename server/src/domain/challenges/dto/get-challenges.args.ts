import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '~/common/pagination/pagination.args';

@ArgsType()
export class GetChallengesArgs extends PaginationArgs {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
