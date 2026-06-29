import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { UpdateUserPreferences } from '../UpdateUserPreferences';
import { IUserRepository } from '@chessome/ports';
import { User, UserPreferences, AuthProvider, UserRole, UserStatus, Theme, BoardTheme } from '@chessome/core';

describe('UpdateUserPreferences', () => {
  let mockUserRepository: Mocked<IUserRepository>;
  let useCase: UpdateUserPreferences;
  let testUser: User;

  beforeEach(() => {
    mockUserRepository = {
      findById: vi.fn(),
      findByAuthProvider: vi.fn(),
      save: vi.fn(),
    };
    useCase = new UpdateUserPreferences(mockUserRepository);

    testUser = User.create({
      id: 'test-user-id',
      authProvider: AuthProvider.SUPABASE,
      authProviderId: 'supabase-id',
      email: 'test@example.com',
      emailVerified: true,
      username: 'testuser',
      displayName: 'Test User',
      avatarUrl: null,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    testUser.setPreferences(UserPreferences.createDefault('test-pref-id'));
  });

  it('should successfully update user preferences', async () => {
    mockUserRepository.findById.mockResolvedValue(testUser);

    const initialVersion = testUser.preferences!.preferencesVersion;

    const result = await useCase.execute('test-user-id', {
      theme: Theme.LIGHT,
      boardTheme: BoardTheme.GREEN,
      engineDepth: 22
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('test-user-id');
    expect(mockUserRepository.save).toHaveBeenCalledWith(testUser);
    
    expect(result.preferences?.theme).toBe(Theme.LIGHT);
    expect(result.preferences?.boardTheme).toBe(BoardTheme.GREEN);
    expect(result.preferences?.engineDepth).toBe(22);
    expect(result.preferences?.preferencesVersion).toBe(initialVersion + 3); // updated 3 fields
  });

  it('should throw if user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', { theme: Theme.LIGHT }))
      .rejects.toThrow('User not found');
  });
});
