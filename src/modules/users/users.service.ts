import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PRISMA_ERRORS } from '../prisma/constants/constants';
import { ResourceNotFoundException } from 'src/common/errors/exceptions';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  create(email: string, hash: string) {
    const user = {
      email,
      hash,
    }
    return this.prisma.user.create({ data: user });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  promoteToAdmin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { roles: [Role.USER, Role.ADMIN] }
    }).catch(error => {
      if(error instanceof PrismaClientKnownRequestError && error.code === PRISMA_ERRORS.RECORD_TO_DOES_NOT_EXIST){
        throw new ResourceNotFoundException(ERROR_MSG_MOVIES.MOVIE_NOT_FOUND);
      }
    });
  }
}
