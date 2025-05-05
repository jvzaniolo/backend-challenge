import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomUuidScalar } from './@core/scalar/uuid.scalar';
import { ChallengesModule } from './challenges/challenges.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      graphiql: true,
      resolvers: {
        UUID: CustomUuidScalar,
      },
    }),
    TypeOrmModule.forRoot({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ChallengesModule,
    SubmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
