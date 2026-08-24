import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { User } from '../src/user/entities/user.entity';
import request from 'supertest';
import { Post } from '../src/post/entities/post.entity';

describe('PostController (e2e)', () => {
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
        username: 'max_doe',
        email: 'max@example.com',
        password: 'Password123!',
        bio: 'Hello world',
      }),
    );
    createdUserId = user.id;

    const anotherUser = await userRepo.save(
      userRepo.create({
        username: 'kate_doe',
        email: 'kate@example.com',
        password: 'Password123!',
        bio: 'Another user bio',
      }),
    );
    anotherUserId = anotherUser.id;

    const registerRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'max@example.com',
        password: 'Password123!',
      });

    accessToken = (registerRes.body as { accessToken: string }).accessToken;
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        title: 'First Post',
        content: 'This is the content of the post.',
      };

      const res = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(createPostDto.title);
      expect(res.body.content).toBe(createPostDto.content);
    });
  });

  describe('PATCH /posts/:id', () => {
    it('should update a post successfully', async () => {
      const createdPost = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Old Title', content: 'Old Content' });

      const postId = createdPost.body.id;

      const res = await request(app.getHttpServer())
        .patch(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(res.body.title).toBe('Updated Title');
    });

    it('should return 403 Forbidden when trying to update another user post', async () => {
      const postRepo = dataSource.getRepository(Post);
      const anotherUserPost = await postRepo.save(
        postRepo.create({
          title: 'Kate Original Title',
          content: 'Kate Post Content',
          userId: anotherUserId,
        }),
      );

      await request(app.getHttpServer())
        .patch(`/posts/${anotherUserPost.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })
        .expect(403);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post successfully', async () => {
      const createdPost = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'To Delete', content: 'Delete me' });

      const postId = createdPost.body.id;

      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      await request(app.getHttpServer()).get(`/posts/${postId}`).expect(404);
    });

    it('should return 403 Forbidden when trying to delete another user post', async () => {
      const postRepo = dataSource.getRepository(Post);
      const anotherUserPost = await postRepo.save(
        postRepo.create({
          title: 'Kate Original Title',
          content: 'Kate Post Content',
          userId: anotherUserId,
        }),
      );

      await request(app.getHttpServer())
        .delete(`/posts/${anotherUserPost.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })
        .expect(403);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
