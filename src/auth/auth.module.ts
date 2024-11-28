import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]), // Se definen las entidades a las que este modulo debe hacerle revisión para la sincronización con la DB
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    /**
     * * Configuración de la app para el manejo de JWT
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => {
        return {
          secret: _configService.get('JWT_SECRET'),
          signOptions: {
            /**
             * * Expiracion
             * @param '10s' -> 10 segundos.
             * @param '10m' -> 10 minutos. 
             * @param '1h' -> 1 hora. 
             * @param '2d' -> 2 días. 
             * @param '1w' -> 1 semana. 
             */
            expiresIn: '10m' //Expiración del token (10 minutos)
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
