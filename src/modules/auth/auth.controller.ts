import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { WrongPasswordException } from './errors/auth.exceptions';
import { ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Login successful, returns JWT token.'})
  @ApiForbiddenResponse({ description: ERROR_MSG_LOGIN.WRONG_PASSWORD })
  @ApiNotFoundResponse({ description: ERROR_MSG_LOGIN.EMAIL_NOT_FOUND })
  login(@Body() loginDto: LoginDto) {
    return this.auth.login(loginDto.email, loginDto.password).catch(e => {
      if(e instanceof WrongPasswordException){
        throw new ForbiddenException(e.message);
      }
    });
  }

  @Post('register')
  @ApiOkResponse({ description: 'Register successful, returns JWT token.' })
  @ApiConflictResponse({ description: ERROR_MSG_REGISTER.DUPLICATED_EMAIL })
  register(@Body() registerDto: RegisterDto) {
    return this.auth.register(registerDto.email, registerDto.password);
  }
}

