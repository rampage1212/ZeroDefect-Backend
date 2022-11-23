import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvHelper } from './common/helpers/env.helper';
import { validate } from './common/validators/env.validator';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import s3Config from './config/s3.config';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthRefreshTokenModule } from './auth-refresh-token/auth-refresh-token.module';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, s3Config],
      validate: validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('databaseConfig.dbUri'),
        retryWrites: true,
        w: 'majority',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TaskModule,
    AuthRefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
