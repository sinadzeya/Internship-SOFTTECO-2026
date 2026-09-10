import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccount } from './entities/social-accounts.entity';
import { SocialAccountAccess } from './entities/social-accounts-accesses.entity';
import { SocialAccountController } from './social-accounts.controller';
import { SocialAccountService } from './social-account.service';
import { SocialAccountRequest } from './entities/social-accounts-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SocialAccount,
      SocialAccountAccess,
      SocialAccountRequest,
    ]),
  ],
  controllers: [SocialAccountController],
  providers: [SocialAccountService],
})
export class SocialAccountModule {}
