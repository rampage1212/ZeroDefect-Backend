import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './task.schema';
import { S3_PROVIDER_TOKEN } from './task.types';

@Injectable()
export class TaskService {
  constructor(
    @Inject(S3_PROVIDER_TOKEN) private s3,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(file: Express.Multer.File, body: CreateTaskDto, user_id: string): Promise<Task> {
    const { url } = await this.uploadPublicFile(file.buffer, file.filename);
    const task = new this.taskModel({ ...body, imageUrl: url, user_id });

    return task.save();
  }

  async findById(id: string): Promise<any> {
    const task = this.taskModel.findOne({ id }).exec();

    return task;
  }

  async getAllItems() {
    const tasks = this.taskModel.find().exec();

    return tasks;
  }

  async getLimitedItems(limit: number, pageNumber: number): Promise<any> {
    const tasks = this.taskModel
      .find()
      .limit(limit)
      .skip(pageNumber * limit)
      .exec();

    return tasks;
  }

  async update(_id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updates: Partial<Task> = {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
    };
    await this.taskModel.findByIdAndUpdate(_id, updates).exec();
    const task = await this.taskModel.findOne({ id: _id });

    return task;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.deleteOne({ id }).exec();

    return result.acknowledged;
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<{ key: string; url: string }> {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.configService.get('s3Config.s3Bucket'),
          Body: dataBuffer,
          Key: `${uuid()}-${filename}`,
        })
        .promise();

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (err) {
      throw err;
    }
  }
}
