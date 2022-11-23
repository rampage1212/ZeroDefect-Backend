import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthRefreshTokenService } from '@src/auth-refresh-token/auth-refresh-token.service';
import { TokensResponseDto } from './dto/tokens-response.dto';
import RefreshTokensDto from './dto/refresh-tokens.dto';
import { User } from '@src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async login(user: Partial<User>): Promise<TokensResponseDto> {
    const payload = { name: user.name, email: user.email, role: user.permission };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.email);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { name: user.name, email: user.email, permission: user.permission };
    }

    return null;
  }

  private async createRefreshToken(userId: string) {
    return this.authRefreshTokenService.create(userId);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRefreshTokenService.deleteByToken(refreshToken);
  }

  async refreshTokens(params: RefreshTokensDto): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.authRefreshTokenService.findOneBy({ token: params.refreshToken });
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (oldRefreshToken.expireAt.getTime() < new Date().getTime()) {
      throw new UnauthorizedException('Refresh token is expired');
    }
    await this.authRefreshTokenService.deleteByToken(params.refreshToken);
    const user = await this.userService.findOneById(oldRefreshToken.user.toString());
    const accessToken = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
