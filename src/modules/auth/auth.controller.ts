import { Body, Controller, ForbiddenException, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { WrongPasswordException } from './errors/auth.exceptions';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password).catch(e => {
      if(e instanceof WrongPasswordException){
        throw new ForbiddenException;
      }
    });
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }
}

