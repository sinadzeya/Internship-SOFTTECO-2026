import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/access-token.type';
import { UserService } from '../user/user.service';

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

  async login(user: User): Promise<AccessToken> {
    this.logger.log(`User logged in: ${user.id}`);
    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
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

    if (!user || !user.currentHashedRefreshToken) {
      this.logger.warn(
        `Refresh failed: User ${userId} not found or has no active refresh token`,
      );
      throw new UnauthorizedException('Access Denied');
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
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

  async register(createUserDto: CreateUserDto) {
    this.logger.log('Start user registration process');
    const newUser = await this.userService.create(createUserDto);
    this.logger.log(`User registered successfully: ${newUser.id}`);

    return this.login(newUser);
  }
}
