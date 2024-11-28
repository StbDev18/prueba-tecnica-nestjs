import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Task } from './entities/task.entity';

@ApiTags('Tasks') // Tag grupo Swagger
@Controller('tasks')
@Auth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Tasks founded', type: [Task] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.tasksService.findAll(paginationDto, user);
  }

  @Get(':term')
  @ApiResponse({ status: 200, description: 'Task founded', type: Task })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  findOne(
    @Param('term', ParseUUIDPipe) term: string,
    @GetUser() user: User
  ) {
    return this.tasksService.findOne(term, user);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Task created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.tasksService.remove(id, user);
  }
}
