import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginDto) {
    const user = await this.authService.validateUser(
      loginBody.email,
      loginBody.password,
    );

    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register(registerBody);
  }
}
