import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, SigninUserDto } from './dto';
import { User } from './entities/user.entity';

@ApiTags('Auth') // Tag grupo Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * * Controlador para registrar usuarios
   * @param createUserDto DTO del usuario: estructura como debe llegar la información desde el cliente
   */
  @Post('signup')
  @ApiResponse({status: 201, description: 'Sign Up Succesfull !!!', type: User})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error !' })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * * Controlador para registrar usuarios
   * @param createUserDto DTO del usuario: estructura como debe llegar la información desde el cliente
   */
  @Post('login')
  @ApiResponse({status: 201, description: 'Sign In Successfull !!!', type: User})
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiResponse({status: 404, description: 'Not Found'})
  @ApiResponse({status: 500, description: 'Internal server error !!!'})
  login(@Body() signInUserDto: SigninUserDto) {
    return this.authService.singIn(signInUserDto);
  }
}
