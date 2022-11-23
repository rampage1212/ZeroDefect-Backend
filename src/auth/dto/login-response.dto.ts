import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    example: 'John Doe',
    required: true,
    description: 'Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
    description: 'E-mail',
  })
  @IsString()
  email: string;

  @ApiProperty({ example: 1, required: true, description: 'User role' })
  @IsNumber()
  permission: number;
}
