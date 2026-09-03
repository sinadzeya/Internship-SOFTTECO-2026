import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret: string = configService.getOrThrow<string>('JWT_SECRET');
        const expiresIn: string =
          configService.getOrThrow<string>('JWT_EXPIRES_IN');

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as unknown as number,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>(
              'JWT_REFRESH_EXPIRES_IN',
            ) as any,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
