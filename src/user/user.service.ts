import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    body.password = await bcrypt.hash(body.password, 10);
    const user = new this.userModel(body);

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email }).exec();

    return user;
  }

  async findByEmailAndPermission(email: string, permission: number): Promise<User> {
    const user = this.userModel.findOne({ email, permission }).exec();

    return user;
  }

  async findOneById(id: string): Promise<any> {
    return this.userModel.findById(id).exec();
  }
}
