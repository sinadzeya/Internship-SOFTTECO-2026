import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    if (dataSource.isInitialized) {
      const entities = dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
      }
    }
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'olina_janes',
          email: 'olina.janes@example.com',
          password: 'Password123!',
          bio: 'NestJS programmer',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        username: 'james_mclake',
        email: 'james.mclake@example.com',
        password: 'Password123!',
        bio: 'Java programmer',
      });
    });

    it('should log the user in and return accessToken and refreshToken', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'james.mclake@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should reject the login attempt if the password is incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'james.mclake@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'alysa_kim',
          email: 'alysa.kim@example.com',
          password: 'Password123!',
          bio: 'Frontend Developer',
        });

      const body = response.body as { refreshToken: string };
      refreshToken = body.refreshToken;
    });

    it('should refresh tokens when provided a valid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should reject refresh when no token is provided', () => {
      return request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
