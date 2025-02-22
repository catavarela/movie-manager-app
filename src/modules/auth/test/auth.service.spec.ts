import { DuplicatedResourceException, ResourceNotFoundException } from "@common/errors";
import { PRISMA_ERRORS } from "@modules/prisma/constants/constants";
import { UsersService } from "@modules/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthService } from "../auth.service";
import { WrongPasswordException } from "../errors/auth.exceptions";
import * as argon2 from 'argon2';
import { userMockFactory } from "@modules/users/test/users.mock";
import { faker } from "@faker-js/faker/.";

jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  const usersService = {
    create: jest.fn(),
    findOneByEmail: jest.fn()
  }
  const jwtToken = faker.internet.jwt();
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue(jwtToken)
  }
  const user = userMockFactory();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return a token', async () => {
      const email = user.email;
      const password = faker.internet.password();
      usersService.create.mockResolvedValue(user);
      const spyArgon = jest.spyOn(argon2, 'hash').mockResolvedValue('hash');
      const spyUserToken = jest.spyOn(authService as any, 'userToken')

      const result = await authService.register(email, password);

      expect(spyArgon).toHaveBeenCalledWith(password);
      expect(usersService.create).toHaveBeenCalledWith(email, 'hash');
      expect(spyUserToken).toHaveBeenCalledWith(user.id, user.email, user.roles);
      expect(result).toEqual({ access_token: jwtToken });
    });

    it('should throw DuplicatedResourceException if email is already in use', async () => {
      const prismaError = new PrismaClientKnownRequestError('Duplicated record', {
        code: PRISMA_ERRORS.UNIQUE_CONSTRAINT_FAILED,
        clientVersion: ''
      });
      usersService.create.mockRejectedValue(prismaError);

      await expect(authService.register(user.email, 'password')).rejects.toThrow(DuplicatedResourceException);
    });
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      const email = user.email;
      const password = faker.internet.password();
      usersService.findOneByEmail.mockResolvedValue(user);
      const spyArgon = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      const spyUserToken = jest.spyOn(authService as any, 'userToken');

      const result = await authService.login(email, password);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(spyArgon).toHaveBeenCalledWith(user.hash, password);
      expect(spyUserToken).toHaveBeenCalledWith(user.id, user.email, user.roles);
      expect(result).toEqual({ access_token: jwtToken });
    });

    it('should throw ResourceNotFoundException if email does not exist', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.login(faker.internet.email(), faker.internet.password())).rejects.toThrow(ResourceNotFoundException);
    });

    it('should throw WrongPasswordException if password is incorrect', async () => {
      usersService.findOneByEmail.mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(authService.login(user.email, 'wrong_password')).rejects.toThrow(WrongPasswordException);
    });
  });
});
