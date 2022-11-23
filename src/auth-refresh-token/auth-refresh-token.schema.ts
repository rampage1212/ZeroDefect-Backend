import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@src/user/user.schema';
import { Document, Types } from 'mongoose';

export type UserRefreshTokenDocument = UserRefreshToken & Document;

@Schema()
export class UserRefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: 0 })
  expireAt: Date;
}

export const UserRefreshTokenSchema = SchemaFactory.createForClass(UserRefreshToken);
