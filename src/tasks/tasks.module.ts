import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Task]) // Se definen las entidades a las que este modulo debe hacerle revisión para la sincronización
  ],
  exports: [
    TasksService,
    TypeOrmModule
  ]
})
export class TasksModule {}
