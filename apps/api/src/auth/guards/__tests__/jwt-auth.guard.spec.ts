import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { AuthProvider } from '@chessome/core';

describe('JwtAuthGuard', () => {
  let authProvider: any;
  let syncUserIdentity: any;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    authProvider = {
      validateToken: vi.fn(),
    };
    syncUserIdentity = {
      execute: vi.fn(),
    };
    guard = new JwtAuthGuard(authProvider, syncUserIdentity);
  });

  const mockExecutionContext = (authHeader: string | undefined) => {
    const request = {
      headers: {
        authorization: authHeader
      },
      user: null
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as any;
  };

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const context = mockExecutionContext(undefined);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = mockExecutionContext('Bearer invalid-token');
    authProvider.validateToken.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(authProvider.validateToken).toHaveBeenCalledWith('invalid-token');
  });

  it('should sync identity and attach user to request if token is valid', async () => {
    const context = mockExecutionContext('Bearer valid-token');
    const identity = { providerId: '123', email: 'test@test.com' };
    const domainUser = { id: 'domain-user-id' };

    authProvider.validateToken.mockResolvedValue(identity);
    syncUserIdentity.execute.mockResolvedValue(domainUser);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(syncUserIdentity.execute).toHaveBeenCalledWith({
      identity,
      provider: AuthProvider.SUPABASE
    });

    const req = context.switchToHttp().getRequest();
    expect(req.user).toBe(domainUser);
  });
});
