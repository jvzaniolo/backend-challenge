import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ChallengeResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
