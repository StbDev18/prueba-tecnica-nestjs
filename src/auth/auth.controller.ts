import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SigninUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * * Controlador para registrar usuarios
   * @param createUserDto DTO del usuario: estructura como debe llegar la información desde el cliente
   */
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * * Controlador para registrar usuarios
   * @param createUserDto DTO del usuario: estructura como debe llegar la información desde el cliente
   */
  @Post('login')
  login(@Body() signInUserDto: SigninUserDto) {
    return this.authService.singIn(signInUserDto);
  }
}
