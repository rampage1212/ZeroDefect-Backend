import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user/user.schema';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @ApiProperty({ example: 'Eat breakfast', required: true, description: 'Task title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Description', required: true, description: 'Task description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 'https://www.google.com', description: 'Task image url' })
  @Prop()
  imageUrl: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
