import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

describe('AuthGuard', () => {
  let jwtService: JwtService = new JwtService();
  let configService: ConfigService = new ConfigService();
  let authGuard: AuthGuard = new AuthGuard(jwtService, configService);
  let mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
  };

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should allow access with a valid token', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer validToken' },
    };
    
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue(mockRequest);
    jest.spyOn(configService, 'get').mockReturnValue('secret');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 'user1' });
    
    await expect(authGuard.canActivate(mockExecutionContext as unknown as ExecutionContext)).resolves.toBe(true);
    expect(mockRequest['user']).toEqual({ id: 'user1' });
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockRequest = { headers: {} };
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue(mockRequest);
    
    await expect(authGuard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer invalidToken' },
    };
    
    jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest').mockReturnValue(mockRequest);
    jest.spyOn(configService, 'get').mockReturnValue('secret');
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());
    
    await expect(authGuard.canActivate(mockExecutionContext as unknown as ExecutionContext)).rejects.toThrow(UnauthorizedException);
  });
});
