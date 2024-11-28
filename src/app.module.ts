import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(), // Configuración para variables de entorno
    TypeOrmModule.forRoot({ // Objeto de conexión de TypeOrm
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // Carga automaticamente las entidades a medida que se crean
      synchronize: true, // Usualmente en producción no se usa, ya que sincroniza con cualquier cambio de la Base de datos
    }),
    TasksModule, AuthModule, CommonModule
  ],
})
export class AppModule {}
