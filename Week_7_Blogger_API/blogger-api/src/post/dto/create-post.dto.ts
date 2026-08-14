import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
