import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccount } from './entities/social-accounts.entity';
import { SocialAccountAccess } from './entities/social-accounts-access.entity';
import { SocialAccountController } from './social-accounts.controller';
import { SocialAccountService } from './social-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount, SocialAccountAccess])],
  controllers: [SocialAccountController],
  providers: [SocialAccountService],
})
export class SocialAccountModule {}
