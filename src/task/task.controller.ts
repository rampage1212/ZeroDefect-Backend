import {
  Controller,
  Request,
  Get,
  UseGuards,
  Body,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  ParseFilePipe,
  MaxFileSizeValidator,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.schema';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(Task))
  @ApiResponse(ApiResponseHelper.unauthorized())
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req,
    @Body() body: CreateTaskDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Task> {
    return this.taskService.create(file, body, req.user.id);
  }

  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(Task))
  @ApiResponse(ApiResponseHelper.unauthorized())
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(@Query('pagenumber') pagenumber: number, @Query('limit') limit: number) {
    return this.taskService.getAllItems();
    // return this.taskService.getLimitedItems(limit, pagenumber);
  }

  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(Task))
  @ApiResponse(ApiResponseHelper.unauthorized())
  @UseGuards(JwtAuthGuard)
  @Put('/:taskId')
  async update(@Param('taskId') _id: string, @Body() body: UpdateTaskDto): Promise<Task> {
    return this.taskService.update(_id, body);
  }
  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(Boolean))
  @ApiResponse(ApiResponseHelper.unauthorized())
  @UseGuards(JwtAuthGuard)
  @Delete('/:taskId')
  async delete(@Param('taskId') _id: string): Promise<boolean> {
    return this.taskService.delete(_id);
  }
}
