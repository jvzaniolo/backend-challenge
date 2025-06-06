import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { SubmissionStatus } from '~/domain/submissions/entities/submission';
import { PaginationArgs } from './pagination.args';

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
