import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: { username?: string; password?: string }) {
    // Verificar que se proporcionaron los datos necesarios
    if (!loginDto?.username || !loginDto?.password) {
      throw new HttpException(
        'Username and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Continuar con el proceso de login
    const response = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );
    if (!response.token) {
      return { success: false, message: 'Invalid credentials' };
    }
    return { success: true, token: response.token };
  }
}
