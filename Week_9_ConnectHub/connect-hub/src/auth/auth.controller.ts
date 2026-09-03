import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshTokens(
    @Request() req: { user: { userId: string; refreshToken: string } },
  ) {
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: { user: { userId: string } }) {
    return this.authService.logout(req.user.userId);
  }
}
