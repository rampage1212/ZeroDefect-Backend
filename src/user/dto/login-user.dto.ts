import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'john.doe@example.com', required: true, description: 'User email' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password123!@#', required: true, description: 'User password' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
