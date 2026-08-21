import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { User } from '../src/user/entities/user.entity';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let accessToken: string;
  let createdUserId: string;
  let anotherUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: createdUserId };
          return true;
        },
      })
      .compile();

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
    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.save(
      userRepo.create({
        username: 'john_doe',
        email: 'john@example.com',
        password: 'Password123!',
        bio: 'Hello world',
      }),
    );
    createdUserId = user.id;

    const anotherUser = await userRepo.save(
      userRepo.create({
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'Password123!',
        bio: 'Another user bio',
      }),
    );
    anotherUserId = anotherUser.id;

    const registerRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Password123!',
      });

    accessToken = (registerRes.body as { accessToken: string }).accessToken;
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      return await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user by UUID', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdUserId);
          expect(res.body).toHaveProperty('email', 'john@example.com');
        });
    });

    it('should return 400 Bad Request if ID is not a valid UUID', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-uuid-123')
        .expect(400);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user fields successfully', () => {
      return request(app.getHttpServer())
        .patch(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'Updated bio information',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('bio', 'Updated bio information');
        });
    });

    it('should return 403 Forbidden when trying to update another user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${anotherUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'Hacked bio',
        })
        .expect(403);
    });

    it('should return 400 Bad Request if UUID is invalid on PATCH', () => {
      return request(app.getHttpServer())
        .patch('/users/invalid-uuid')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ bio: 'Test' })
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 403 Forbidden when trying to delete another user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${anotherUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('should return 400 Bad Request if UUID is invalid on DELETE', () => {
      return request(app.getHttpServer())
        .delete('/users/not-a-uuid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should remove the user', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
