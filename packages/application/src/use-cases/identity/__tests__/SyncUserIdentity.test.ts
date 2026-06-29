import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncUserIdentity } from '../SyncUserIdentity';
import { AuthProvider, UserRole, UserStatus } from '@chessome/core';
import { IUserRepository } from '@chessome/ports';

describe('SyncUserIdentity', () => {
  let userRepository: import('vitest').Mocked<IUserRepository>;
  let syncUserIdentity: SyncUserIdentity;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByAuthProvider: vi.fn(),
      save: vi.fn(),
    };
    syncUserIdentity = new SyncUserIdentity(userRepository);
  });

  it('should create a new user with preferences and statistics if one does not exist', async () => {
    userRepository.findByAuthProvider.mockResolvedValue(null);

    const identity = {
      providerId: 'supa-123',
      email: 'test@example.com',
      displayName: 'Test User'
    };

    const user = await syncUserIdentity.execute({
      identity,
      provider: AuthProvider.SUPABASE
    });

    expect(userRepository.findByAuthProvider).toHaveBeenCalledWith(AuthProvider.SUPABASE, 'supa-123');
    expect(user.authProvider).toBe(AuthProvider.SUPABASE);
    expect(user.authProviderId).toBe('supa-123');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe(UserRole.USER);
    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.preferences).toBeDefined();
    expect(user.statistics).toBeDefined();
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });

  it('should return existing user and update profile if it exists', async () => {
    const existingUser = {
      updateProfile: vi.fn()
    } as any;

    userRepository.findByAuthProvider.mockResolvedValue(existingUser);

    const identity = {
      providerId: 'supa-123',
      email: 'test@example.com',
      displayName: 'New Name'
    };

    const user = await syncUserIdentity.execute({
      identity,
      provider: AuthProvider.SUPABASE
    });

    expect(existingUser.updateProfile).toHaveBeenCalledWith({
      displayName: 'New Name',
      avatarUrl: undefined,
      username: undefined
    });
    expect(userRepository.save).toHaveBeenCalledWith(existingUser);
    expect(user).toBe(existingUser);
  });
});
