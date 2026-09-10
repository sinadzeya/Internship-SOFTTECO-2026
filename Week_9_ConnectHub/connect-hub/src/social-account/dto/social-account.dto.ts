import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class AddSocialAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  platform!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  accountName!: string;
}

export class UpdateSocialAccountDto extends PartialType(AddSocialAccountDto) {}

export class GrantAccessDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  socialAccountId!: string;

  @IsBoolean()
  clientHasAccess!: boolean;
}

export class CreateSocialAccountRequestDto {
  @IsUUID()
  @IsNotEmpty()
  ownerId!: string;
}
