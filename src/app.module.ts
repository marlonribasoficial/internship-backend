import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { envValidationSchema } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: true },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    UsersModule,
    PostsModule,
    CommentsModule,
    ScheduleModule.forRoot(),
    AuthModule,
    ReactionsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
