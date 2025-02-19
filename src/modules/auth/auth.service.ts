import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PRISMA_ERRORS } from 'src/modules/prisma/constants/constants';
import { DuplicatedResourceException, ResourceNotFoundException } from 'src/common/errors/exceptions';
import { WrongPasswordException } from './errors/auth.exceptions';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwtService: JwtService){}

  async register(email: string, password: string) {
    const hash = await argon2.hash(password);

    const user = await this.users.create(email, hash).catch(error => {
      if(error instanceof PrismaClientKnownRequestError && error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED){
        throw new DuplicatedResourceException(ERROR_MSG_REGISTER.DUPLICATED_EMAIL);
      }
      throw error;
    });
    
    return await this.userToken(user.id, user.email, user.roles);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOneByEmail(email);

    if(!user) {
      throw new ResourceNotFoundException(ERROR_MSG_LOGIN.EMAIL_NOT_FOUND);
    }

    const passwordMatch = await argon2.verify(user.hash, password);

    if(!passwordMatch) {
      throw new WrongPasswordException();
    }

    return await this.userToken(user.id, user.email, user.roles);
  }

  async userToken(id: string, email: string, roles: Role[]) {
    const payload = { sub: id, email, roles };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
