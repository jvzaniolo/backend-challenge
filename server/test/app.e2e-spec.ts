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
              id
              title
              description
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
    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `#graphql
          mutation {
            submitChallenge(challengeId: "67091500-b2d0-439d-b40f-a3d8e1c12545", repositoryUrl: "https://github.com/user/repo") {
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
