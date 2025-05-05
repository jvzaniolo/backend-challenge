import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DateRangeArgs {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}
