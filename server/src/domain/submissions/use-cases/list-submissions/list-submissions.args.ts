import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginationArgs } from '~/common/pagination/pagination.args';
import { SubmissionStatus } from '../../entities/submission.entity';

@InputType()
class DateRangeArgs {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

@ArgsType()
export class ListSubmissionsArgs extends PaginationArgs {
  @Field(() => SubmissionStatus, { nullable: true })
  status?: SubmissionStatus;

  @Field(() => DateRangeArgs, { nullable: true })
  dateRange?: DateRangeArgs;

  @Field({ nullable: true })
  challengeTitle?: string;
}
