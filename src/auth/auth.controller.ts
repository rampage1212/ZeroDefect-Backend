import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request as RequestForCookie, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from '@src/user/user.schema';
import RefreshTokensDto from './dto/refresh-tokens.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @ApiResponse(ApiResponseHelper.success(LoginResponseDto))
  @ApiResponse(ApiResponseHelper.validationError('Validation failed'))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const authData = await this.authService.login(req.user);

    res.cookie('refreshToken', authData.refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return { accessToken: authData.accessToken, role: req.user.permission };
  }

  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(User))
  @ApiResponse(ApiResponseHelper.unauthorized())
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async success(@Request() req) {
    return req.user;
  }

  @ApiResponse(ApiResponseHelper.successWithExample({}, HttpStatus.OK))
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: RequestForCookie): Promise<void> {
    const { refreshToken } = req.cookies || {};

    // if (!refreshToken) {
    //   throw new BadRequestException('Refresh token is missing');
    // }

    // return this.authService.logout(String(refreshToken));
  }

  @Post('refresh-tokens')
  async refreshTokens(@Body() params: RefreshTokensDto, @Res({ passthrough: true }) res: Response): Promise<any> {
    const authData = await this.authService.refreshTokens(params);

    res.cookie('refreshToken', authData.refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return { accessToken: authData.accessToken };
  }
}
