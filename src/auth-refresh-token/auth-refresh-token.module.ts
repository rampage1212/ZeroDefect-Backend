import { Module } from '@nestjs/common';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRefreshToken, UserRefreshTokenSchema } from './auth-refresh-token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRefreshToken.name, schema: UserRefreshTokenSchema }])],
  providers: [AuthRefreshTokenService],
  exports: [AuthRefreshTokenService],
})
export class AuthRefreshTokenModule {}
