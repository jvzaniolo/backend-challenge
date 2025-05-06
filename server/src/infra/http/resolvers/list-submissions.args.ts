import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginationArgs } from '~/core/pagination/pagination.args';
import { SubmissionStatus } from '~/domain/submissions/entities/submission.entity';

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
