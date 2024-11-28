import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Task)
    private readonly _taskRepository: Repository<Task>,
    private readonly dataSoruce: DataSource
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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const tasks = await this._taskRepository.find({
      take: limit,
      skip: offset
    });
    return tasks
  }

  async findOne(term: string) {
    let task: Task;

    if (isUUID(term)) {
      task = await this._taskRepository.findOneBy({ id: term }); // Las imagenes vienen por el eager de la entidad
    } else {
      const queryBuilder = this._taskRepository.createQueryBuilder('prod');
      task = await queryBuilder
        .where('UPPER(title)=:title', {
          title: term.toUpperCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages') // Esto me permite traer las imagenes para la busqueda
        .getOne();
    }

    if (!task) throw new NotFoundException(`Product with id '${term}' not found`);

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {

    //Create query runner
    const queryRunner = this.dataSoruce.createQueryRunner(); // Este no va a impactar la DB hasta que se confirme el commit
    await queryRunner.connect(); // Nos conectamos a la DB
    await queryRunner.startTransaction(); // Lo que se ejecute se relaciona a la transaccion

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

      task.user = user;



      /**
       * *Logica de queryRunner
       * ! Cuidado: si se habilita se deve inhabilitar el save del respository
      */
      // await queryRunner.manager.save(task);
      // await queryRunner.commitTransaction(); // Confirmamos la transaccion
      // await queryRunner.release(); // Detenemos el query runner, tocaria arrancarlo de nuevo en caso tal de necesitarse

      await this._taskRepository.save(task);

      return task;
    } catch (error) {

      /**
       * * Logica de rollback de queryRunner
       * ! Cuidado: se habilita si se hace uso del queryRunner
       * ? hace rollback de la transaccion en caso tal de que ocurra algo en alguno de los procesos de la transaccion
      */
      // await queryRunner.rollbackTransaction();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const task = await this.findOne(id);

    if (!task) throw new NotFoundException(`Task with id '${id}' not found`);

    const result = await this._taskRepository.remove(task);

    return result;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
