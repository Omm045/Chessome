import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeAnonymousAnalyses } from '../MergeAnonymousAnalyses';
import { IUserRepository } from '@chessome/ports';
import { IGameRepository } from '@chessome/core';
import { ok, err } from '@chessome/shared';

describe('MergeAnonymousAnalyses', () => {
  let userRepository: import('vitest').Mocked<IUserRepository>;
  let gameRepository: any;
  let mergeAnonymousAnalyses: MergeAnonymousAnalyses;

  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByAuthProvider: vi.fn(),
      save: vi.fn(),
    };
    gameRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    mergeAnonymousAnalyses = new MergeAnonymousAnalyses(userRepository, gameRepository);
  });

  it('should merge anonymous games to a user and update statistics', async () => {
    const user = {
      id: 'user-123',
      statistics: {
        recordAnalysis: vi.fn()
      }
    } as any;
    userRepository.findById.mockResolvedValue(user);

    const game = {
      userId: null,
      attachToUser: vi.fn()
    };
    gameRepository.findById.mockResolvedValue(ok(game));

    await mergeAnonymousAnalyses.execute({
      userId: 'user-123',
      anonymousGameIds: ['game-1', 'game-2']
    });

    expect(game.attachToUser).toHaveBeenCalledWith('user-123');
    expect(game.attachToUser).toHaveBeenCalledTimes(2);
    expect(gameRepository.save).toHaveBeenCalledWith(game);
    expect(gameRepository.save).toHaveBeenCalledTimes(2);
    expect(user.statistics.recordAnalysis).toHaveBeenCalledWith(0);
    expect(user.statistics.recordAnalysis).toHaveBeenCalledTimes(2);
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });

  it('should skip games that are already owned', async () => {
    const user = { id: 'user-123', statistics: null } as any;
    userRepository.findById.mockResolvedValue(user);

    const ownedGame = {
      userId: 'other-user',
      attachToUser: vi.fn()
    };
    gameRepository.findById.mockResolvedValue(ok(ownedGame));

    await mergeAnonymousAnalyses.execute({
      userId: 'user-123',
      anonymousGameIds: ['game-1']
    });

    expect(ownedGame.attachToUser).not.toHaveBeenCalled();
    expect(gameRepository.save).not.toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalledWith(user);
  });

  it('should do nothing if anonymousGameIds is empty', async () => {
    await mergeAnonymousAnalyses.execute({
      userId: 'user-123',
      anonymousGameIds: []
    });

    expect(userRepository.findById).not.toHaveBeenCalled();
  });
});
