import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { HTTPLoggerMiddleware } from './http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.getOrThrow<string>('DATABASE_URL');
        const isNeonRemote =
          dbUrl.includes('neon.tech') || dbUrl.includes('sslmode=require');

        return {
          type: 'postgres',
          url: dbUrl,
          ssl: isNeonRemote ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: true,
          logging: process.env.NODE_ENV !== 'test',
        };
      },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf((info: winston.Logform.TransformableInfo) => {
              return `[ConnectHub] - ${String(info.timestamp)} ${String(info.level)}: ${String(info.message)}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService, PostService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes('*');
  }
}
