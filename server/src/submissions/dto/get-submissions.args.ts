import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { SubmissionStatus } from '../submission.entity';
import { DateRangeArgs } from './date-range.args';

@ArgsType()
export class GetSubmissionArgs extends PaginationArgs {
  @Field(() => SubmissionStatus, { nullable: true })
  status?: SubmissionStatus;

  @Field(() => DateRangeArgs, { nullable: true })
  dateRange?: DateRangeArgs;

  @Field({ nullable: true })
  challengeTitle?: string;
}
