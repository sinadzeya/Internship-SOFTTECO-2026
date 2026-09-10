import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialAccountService } from './social-account.service';
import type { RequestWithUser } from '../auth/types/request-with-user.type';
import {
  AddSocialAccountDto,
  CreateSocialAccountRequestDto,
  GrantAccessDto,
  UpdateSocialAccountDto,
} from './dto/social-account.dto';

@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountController {
  constructor(private readonly socialAccountService: SocialAccountService) {}

  @Post()
  addAccount(@Req() req: RequestWithUser, @Body() dto: AddSocialAccountDto) {
    return this.socialAccountService.addAccount(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.socialAccountService.remove(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSocialAccountDto,
    @Req() req: RequestWithUser,
  ) {
    return this.socialAccountService.update(req.user.userId, id, dto);
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

  @Post('requests')
  async createRequest(
    @Req() req: RequestWithUser,
    @Body() dto: CreateSocialAccountRequestDto,
  ) {
    return await this.socialAccountService.createRequest(req.user.userId, dto);
  }

  @Get('requests-to-me')
  async getRequestsForOwner(@Req() req: RequestWithUser) {
    return await this.socialAccountService.getRequestsForOwner(req.user.userId);
  }

  @Patch('requests/:id/fulfill')
  async markAsFulfilled(@Req() req: RequestWithUser, @Param('id') id: string) {
    return await this.socialAccountService.markAsFulfilled(req.user.userId, id);
  }
}
