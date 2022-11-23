import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Title', required: true, minLength: 1, maxLength: 128, description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(128)
  title: string;

  @ApiProperty({ example: 'Description', required: true, description: 'Task description' })
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
}
