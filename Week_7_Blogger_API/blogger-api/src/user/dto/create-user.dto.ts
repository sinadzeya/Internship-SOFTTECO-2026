import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;
}
