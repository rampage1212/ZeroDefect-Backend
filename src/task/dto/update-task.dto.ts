import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length, MaxLength, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Task title', required: true, description: 'Task title' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  title: string;

  @ApiProperty({ example: 'Description', required: true, description: 'Task description' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 'https://example.com', required: true, description: 'Image URL' })
  @IsUrl()
  @MaxLength(255)
  imageUri: string;
}
