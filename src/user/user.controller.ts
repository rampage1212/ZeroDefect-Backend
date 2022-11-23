import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @ApiResponse(ApiResponseHelper.success(User))
  @ApiResponse(ApiResponseHelper.validationError('Validation failed'))
  @Post('auth/register')
  async register(@Body() body: CreateUserDto): Promise<User> {
    return this.userSevice.create(body);
  }
}
