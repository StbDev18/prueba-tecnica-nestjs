import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from "uuid";
import { UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {

  // tasks: Task[] = [];

  // findAll() {
  //   return this.tasks;
  // }

  // findOne(id: string) {
  //   const task = this.tasks.find(task => task.id === id);
  //   if (!task) throw new NotFoundException(`Task with id "${id}" not found`); //404
  //   return task;
  // }

  // create(createTaskDto: CreateTaskDto) {

  //   const { title, description } = createTaskDto;

  //   const task: Task = {
  //     id: uuid(),
  //     title: title.toLocaleLowerCase(),
  //     description: title.toLocaleLowerCase(),
  //     createdAt: new Date().getTime()
  //   };

  //   this.tasks.push(task);

  //   return task;
  // }

  // update(id: string, updateTaskDto: UpdateTaskDto) {
  //   let taskDB = this.findOne(id);
  //   this.tasks = this.tasks.map(task => {
  //     if (task.id === id) {
  //       task.updatedAt = new Date().getTime();
  //       taskDB = { ...taskDB, ...updateTaskDto };
  //       return taskDB;
  //     }
  //     return task;
  //   })
  //   return taskDB;
  // }

  // remove(id: string) {
  //   this.tasks = this.tasks.filter(task => task.id !== id );
  // }

  // fiilTasksWithSeedData(tasks: Task[]) {
  //   this.tasks = tasks;
  // }

  private readonly logger = new Logger('TaskService');

  constructor(
    @InjectRepository(Task)
    private readonly _taskRepository: Repository<Task>
  ) { }

  async create(createTaskDto: CreateTaskDto, user: User) {

    try {

      const task = this._taskRepository.create({
        ...createTaskDto,
        user,
      }); // Crea el objeto en memoria antes de insertarlo en la base de datos

      await this._taskRepository.save(task);

      return task;
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto;
    const tasks = await this._taskRepository.find({
      take: limit,
      skip: offset,
      where: { userId: user.id },
    });
    return tasks
  }

  async findOne(term: string, user: User) {
    let task: Task;

    if (isUUID(term)) {
      task = await this._taskRepository.findOneBy({ id: term, userId: user.id }); // Las imagenes vienen por el eager de la entidad
    } else {
      const queryBuilder = this._taskRepository.createQueryBuilder();
      task = await queryBuilder
        .where('UPPER(title)=:title and userId=:userId', {
          title: term.toUpperCase(),
          userId: user.id,
        })
        .getOne();
    }

    if (!task) throw new NotFoundException(`Task with id '${term}' not found`);

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {

    try {

      const { ...toUpdate } = updateTaskDto;

      /**
       * * preload() no actualiza solo busca en DB una tarea por el id y carga las propiedades del UpdateTaskDto
       */
      const task = await this._taskRepository.preload({
        id,
        ...toUpdate
      });

      if (!task) throw new NotFoundException(`Task with id ${id} not found`);

      // Verificamos si el usuario que hace la actualización es el mismo que creó la tarea
      if (task.userId !== user.id) throw new ForbiddenException('You are not authorized to update this task');

      task.user = user;

      await this._taskRepository.save(task);

      return task;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const task = await this.findOne(id, user);

    if (!task) throw new NotFoundException(`Task with id '${id}' not found`);

    const result = await this._taskRepository.remove(task);

    return result;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status == 403) throw error;

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
