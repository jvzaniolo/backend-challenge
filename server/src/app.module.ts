import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomUuidScalar } from './common/scalar/uuid.scalar';
import { EventsModule } from './infra/events/events.module';
import { HttpModule } from './infra/http/http.module';

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
    HttpModule,
    EventsModule,
  ],
})
export class AppModule {}
