import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { AccessToken } from './types/access-token.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH_SERVICE')
    private readonly jwtRefreshService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.debug('Start password validation process');
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      this.logger.warn('Validation failed: User not found');
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      this.logger.warn('Validation failed: Invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.debug('User validated successfully');
    return user;
  }

  async getTokens(user: User): Promise<AccessToken> {
    this.logger.debug('Start tokens generation process');
    const payload = { email: user.email, id: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtRefreshService.signAsync(payload),
    ]);

    this.logger.debug('Tokens generated successfully');

    return { accessToken, refreshToken };
  }

  async login(loginUserDto: LoginUserDto): Promise<AccessToken> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in: ${user.email}`);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
    this.logger.log(`User logged out: ${userId}`);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    if (!refreshToken) {
      await this.userService.updateRefreshToken(userId, null);
      return;
    }

    this.logger.debug('Start refresh token hash process');
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
    this.logger.debug('Refresh token hashed and saved successfully');
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AccessToken> {
    this.logger.log(`Start refresh tokens process for user: ${userId}`);
    const user = await this.userService.findOne(userId);

    if (!user || !user.currentRefreshToken) {
      this.logger.warn(
        `Refresh failed: User ${userId} not found or has no active refresh token`,
      );
      throw new UnauthorizedException('Access Denied');
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    if (!isMatch) {
      this.logger.warn(`Refresh failed: Token mismatch for user ${userId}`);
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`Tokens refreshed successfully for user: ${userId}`);
    return tokens;
  }

  async register(registerUserDto: RegisterUserDto) {
    this.logger.log('Start user registration process');
    const newUser = await this.userService.create(registerUserDto);
    this.logger.log(`User registered successfully: ${newUser.id}`);

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }
}
