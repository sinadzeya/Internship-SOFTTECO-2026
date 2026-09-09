import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

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

export class GrantAccessDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  socialAccountId!: string;

  @IsBoolean()
  clientHasAccess!: boolean;
}
