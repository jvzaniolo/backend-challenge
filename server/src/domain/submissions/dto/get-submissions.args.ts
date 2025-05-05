import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginationArgs } from '~/common/pagination/pagination.args';
import { SubmissionStatus } from '../submission.entity';

@InputType()
class DateRangeArgs {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

@ArgsType()
export class GetSubmissionArgs extends PaginationArgs {
  @Field(() => SubmissionStatus, { nullable: true })
  status?: SubmissionStatus;

  @Field(() => DateRangeArgs, { nullable: true })
  dateRange?: DateRangeArgs;

  @Field({ nullable: true })
  challengeTitle?: string;
}
