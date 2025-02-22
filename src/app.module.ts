import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MoviesModule } from './modules/movies/movies.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './modules/jobs/jobs.module';
import { GlobalExceptionInterceptor } from './common/errors';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}), AuthModule, UsersModule, MoviesModule, PrismaModule, ScheduleModule.forRoot(), JobsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalExceptionInterceptor,
    }
  ],
})
export class AppModule {}
