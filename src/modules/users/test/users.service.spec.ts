import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResourceNotFoundException } from '@common/errors';
import { createMockContext, MockPrismaContext } from '@modules/prisma/test/prisma.mock.context';
import { PRISMA_ERRORS } from '@modules/prisma/constants/constants';
import { UsersService } from '../users.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { DeepMockProxy } from 'jest-mock-extended';
import { userMockFactory } from './users.mock';
import { faker } from '@faker-js/faker/.';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: DeepMockProxy<PrismaService>;
  const user = userMockFactory();

  beforeEach(async () => {
    prismaService = createMockContext().service;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService }
      ],
    }).compile();
  
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      prismaService.user.create.mockResolvedValue(user);

      const result = await usersService.create(user.email, user.hash);

      expect(prismaService.user.create).toHaveBeenCalledWith({ data: { email: user.email, hash: user.hash } });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const email = user.email;
      prismaService.user.findUnique.mockResolvedValue(user);

      const result = await usersService.findOneByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: email } });
      expect(result).toEqual(user);
    });
  });

  describe('promoteToAdmin', () => {
    it('should promote a user to admin', async () => {
      const id = user.id;
      prismaService.user.update.mockResolvedValue(user);

      const result = await usersService.promoteToAdmin(id);

      expect(prismaService.user.update).toHaveBeenCalledWith({ where: { id }, data: { roles: [Role.USER, Role.ADMIN] } });
      expect(result).toEqual(user);
    });

    it('should throw ResourceNotFoundException if user does not exist when promoting to admin', async () => {
      const prismaError = new PrismaClientKnownRequestError('Record does not exist', {
        code: PRISMA_ERRORS.RECORD_DOES_NOT_EXIST,
        clientVersion: '',
      });
      const nonExistingId = faker.string.uuid();

      prismaService.user.update.mockRejectedValue(prismaError);

      await expect(usersService.promoteToAdmin(nonExistingId)).rejects.toThrow(ResourceNotFoundException);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: nonExistingId },
        data: { roles: [Role.USER, Role.ADMIN] },
      });
    });
  });
});
