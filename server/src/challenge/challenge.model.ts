import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Challenge {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;
}
