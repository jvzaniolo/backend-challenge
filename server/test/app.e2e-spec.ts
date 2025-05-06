import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  }, 20000);

  it('query challenges()', () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `#graphql
          query {
            challenges {
              items {
                id
                title
                description
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.challenges).toBeDefined();
      });
  });

  it('submitChallenge()', async () => {
    const res = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `#graphql
          mutation {
            createChallenge(title: "Test Challenge", description: "Test Description") {
              id
            }
          }
        `,
      });

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `#graphql
          mutation {
            submitChallenge(
              challengeId: "${res.body.data.createChallenge.id}"
              repositoryUrl: "https://github.com/user/repo"
            ) {
              id
              grade
              status
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.submitChallenge).toBeDefined();
      });

    // Wait for the Kafka consumer server to reply
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
