import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

const modelDefinitions = [{ name: User.name, schema: UserSchema }];

@Module({
  imports: [MongooseModule.forFeature(modelDefinitions)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
