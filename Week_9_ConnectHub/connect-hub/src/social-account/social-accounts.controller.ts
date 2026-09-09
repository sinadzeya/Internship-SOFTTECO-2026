import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialAccountService } from './social-account.service';
import type { RequestWithUser } from '../auth/types/request-with-user.type';
import { AddSocialAccountDto, GrantAccessDto } from './dto/social-account.dto';

@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountController {
  constructor(private readonly socialAccountService: SocialAccountService) {}

  @Post()
  addAccount(@Req() req: RequestWithUser, @Body() dto: AddSocialAccountDto) {
    return this.socialAccountService.addAccount(req.user.userId, dto);
  }

  @Get('my')
  getMyAccounts(@Req() req: RequestWithUser) {
    return this.socialAccountService.getMyAccounts(req.user.userId);
  }

  @Post('access')
  grantAccess(@Req() req: RequestWithUser, @Body() dto: GrantAccessDto) {
    return this.socialAccountService.grantOrUpdateAccess(req.user.userId, dto);
  }

  @Get('shared-by-me')
  getSharedByMe(@Req() req: RequestWithUser) {
    return this.socialAccountService.getSharedByMe(req.user.userId);
  }

  @Get('shared-with-me')
  getSharedWithMe(@Req() req: RequestWithUser) {
    return this.socialAccountService.getSharedWithMe(req.user.userId);
  }
}
