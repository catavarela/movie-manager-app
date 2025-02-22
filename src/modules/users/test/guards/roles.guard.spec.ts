import { RolesGuard } from "@modules/users/guards/roles.guard";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";

describe('RolesGuard', () => {
  const reflector: Reflector = new Reflector();
  const rolesGuard: RolesGuard = new RolesGuard(reflector);
  const context: ExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user: {} })
    }),
    getHandler: jest.fn(),
    getClass: jest.fn()
  } as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should return true if user has the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
      user: { roles: [Role.ADMIN] }
    });

    expect(rolesGuard.canActivate(context)).toBe(true);
  });

  it('should return false if user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
      user: { roles: [Role.USER] }
    });

    expect(rolesGuard.canActivate(context)).toBe(false);
  });

  it('should return false if user has no roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({ user: {} });

    expect(rolesGuard.canActivate(context)).toBe(false);
  });
});
