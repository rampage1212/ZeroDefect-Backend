import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { randomBytes } from 'node:crypto';
import { DateTime } from 'luxon';
import { UserRefreshToken } from './auth-refresh-token.schema';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    @InjectModel(UserRefreshToken.name) private readonly userRefreshTokenModel: Model<UserRefreshToken>,
    private readonly configService: ConfigService,
  ) {}
  async create(userId: string): Promise<string> {
    const refreshToken = new this.userRefreshTokenModel({
      user: userId,
      token: randomBytes(32).toString('hex'),
      expireAt: DateTime.now()
        .plus({ days: this.configService.get('jwtConfig.refreshTokenDurationDays') })
        .toJSDate(),
    });

    return (await refreshToken.save()).token;
  }

  async deleteByToken(token: string): Promise<boolean> {
    const deleteResult = await this.userRefreshTokenModel.deleteOne({ token }).exec();

    return deleteResult.acknowledged;
  }

  async findOneBy(params: Partial<UserRefreshToken>): Promise<UserRefreshToken> {
    return this.userRefreshTokenModel.findOne({ ...params });
  }
}
