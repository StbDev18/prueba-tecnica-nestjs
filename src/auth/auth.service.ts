import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, SigninUserDto } from './dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');
  
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _jwtService: JwtService
  ){}
  
  /**
   * * Servicio para registrar usuarios
   */
  async create(createUserDto: CreateUserDto) {

    try {

      /**
       * * Encriptación de contraseña
       */

      const {password, ...userData} = createUserDto;

      /**
       * * Crear y guardar la data
       */
      const user = this._userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10) // Generación de hash (Siempre es diferente)
      }); //Solo crea en memoria

      await this._userRepository.save(user); // Guarda en la DB
      
      delete user.password; // No se debe devolver el password (Lo eliminamos)

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  /**
   * * Servicio para iniciar sesion
   */
  async singIn(singInUserDto: SigninUserDto) {
    const {password, email} = singInUserDto;

    /**
     * * Se hace de esta manera para que solo me devuelva los campos que necesito, es decir "email", "password" y "id"
     * * ya que en el entity el password cuenta con el select: false, si usaramos solo el metodo findOne este nos descarta el password
     */
    const user = await this._userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    }); // Buscamos el usuario por email

    if(!user) throw new UnauthorizedException('Credentials are not valid (email)');
  
    /**
     * * Comparamos la contraseña
     */
    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this._jwtService.sign(payload); // Firma del token
    return token;
  }

  /**
   * * Metodo para capturar el error
   * ? :never quiere decir que jamas retorna un valor
   */
  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

