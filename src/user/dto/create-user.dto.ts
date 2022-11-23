import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { UserExistsByEmailValidator } from '../validators/user-exists-by-email.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: true, description: 'User name' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', required: true, description: 'User email' })
  @IsEmail()
  @MaxLength(255)
  @Validate(UserExistsByEmailValidator)
  email: string;

  @ApiProperty({ example: 'password123!@#', required: true, description: 'User password' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
