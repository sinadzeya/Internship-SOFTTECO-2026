import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return await this.postRepository.find({
      where: { userId },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);

    return await this.postRepository.remove(post);
  }
}
