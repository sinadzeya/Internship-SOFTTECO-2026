import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostCategory } from '../entities/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(PostCategory)
  @IsNotEmpty()
  category!: PostCategory;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
