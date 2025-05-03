import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Submission {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  challengeId: string;

  @Field()
  repositoryUrl: string;

  @Field(() => Float, { nullable: true })
  grade: number;

  @Field({ defaultValue: 'Pending', description: 'Defaults to `Pending`' })
  status: 'Pending' | 'Done' | 'Error';

  @Field()
  createdAt: Date;
}
