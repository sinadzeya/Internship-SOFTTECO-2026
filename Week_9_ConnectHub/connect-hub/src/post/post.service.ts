import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    this.logger.debug(`Start post creation process for user: ${userId}`);
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
    });

    const savedPost = await this.postRepository.save(post);
    this.logger.debug(`Post created successfully with id: ${savedPost.id}`);

    return savedPost;
  }

  async findAll(): Promise<Post[]> {
    this.logger.debug('Fetching all posts from database');
    return await this.postRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Post[]> {
    this.logger.debug(`Fetching posts for user with id: ${userId}`);
    return await this.postRepository.find({
      where: { userId },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: string): Promise<Post> {
    this.logger.debug(`Fetching post with id: ${id}`);
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });

    if (!post) {
      this.logger.warn(`Fetching failed: Post with id ${id} does not exist`);
      throw new NotFoundException(`Post with id ${id} does not exist`);
    }

    return post;
  }

  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    this.logger.debug(`Updating post with id: ${id}`);
    const post = await this.findOne(id);

    const authorId = post.userId || post.user?.id;

    if (authorId !== userId) {
      this.logger.warn(
        `Update forbidden: User ${userId} tried to edit post ${id} owned by ${authorId}`,
      );
      throw new ForbiddenException('You can only edit your own posts');
    }

    Object.assign(post, updatePostDto);

    const updatedPost = await this.postRepository.save(post);
    this.logger.debug(`Post ${id} updated successfully`);

    return updatedPost;
  }

  async remove(id: string, userId: string): Promise<Post> {
    this.logger.debug(`Removing post with id: ${id}`);
    const post = await this.findOne(id);

    const authorId = post.userId || post.user?.id;

    if (authorId !== userId) {
      this.logger.warn(
        `Delete forbidden: User ${userId} tried to delete post ${id} owned by ${authorId}`,
      );
      throw new ForbiddenException('You can only delete your own posts');
    }

    const removedPost = await this.postRepository.remove(post);
    this.logger.debug(`Post ${id} removed successfully`);

    return removedPost;
  }
}
