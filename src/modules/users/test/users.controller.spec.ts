import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { RolesGuard } from '../guards/roles.guard';
import { userMockFactory } from './users.mock';
import { faker } from '@faker-js/faker/.';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = {
    promoteToAdmin: jest.fn(),
    findOneByEmail: jest.fn(),
  };
  const user = userMockFactory();
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('promoteToAdmin', () => {
    it('should ensure role decorator is being applied to the method with ROOT role', async () => {
      const roles = Reflect.getMetadata('roles', UsersController.prototype.promoteToAdmin);
      expect(roles).toEqual([Role.ROOT]);
    });

    it('should promote a user to admin', async () => {
      usersService.promoteToAdmin.mockResolvedValue(user);
      const id = user.id;

      const result = await usersController.promoteToAdmin(id);

      expect(usersService.promoteToAdmin).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });

  describe('searchUserByEmail', () => {
    it('should ensure role decorator is being applied to the method with ROOT role', async () => {
      const roles = Reflect.getMetadata('roles', UsersController.prototype.promoteToAdmin);
      expect(roles).toEqual([Role.ROOT]);
    });
    
    it('should return a user when found', async () => {
      usersService.findOneByEmail.mockResolvedValue(user);
      const email = user.email;

      const result = await usersController.searchUserByEmail(email);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const email = faker.internet.email();
      usersService.findOneByEmail.mockResolvedValue(undefined);

      await expect(usersController.searchUserByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('guards', () => {
    it('should ensure auth guard is being applied to the controller', async () => {
      const guards = Reflect.getMetadata('__guards__', UsersController)
      expect(guards.some(guard => new (guard) instanceof AuthGuard)).toBe(true)
    });

    it('should ensure role guard is being applied to the controller', async () => {
      const guards = Reflect.getMetadata('__guards__', UsersController)
      expect(guards.some(guard => new (guard) instanceof RolesGuard)).toBe(true)
    });
  })
});
