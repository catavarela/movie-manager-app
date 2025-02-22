import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { WrongPasswordException } from '../errors/auth.exceptions';
import { loginDtoMock, registerDtoMock } from './auth.mock';

describe('AuthController', () => {
  let authController: AuthController;
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
  };
  const loginDto = loginDtoMock;
  const registerDto = registerDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    
    it('should call authService.login and return a JWT token on successful login', async () => {
      const token = 'jwt-token';
      authService.login.mockResolvedValue(token);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(token);
    });

    it('should throw ForbiddenException for WrongPasswordException error', async () => {
      const error = new WrongPasswordException();
      authService.login.mockRejectedValue(error);

      await expect(authController.login(loginDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('register', () => {
    it('should call authService.register and return a JWT token on successful registration', async () => {
      const token = 'jwt-token';
      authService.register.mockResolvedValue(token);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto.email, registerDto.password);
      expect(result).toEqual(token);
    });
  });
});
