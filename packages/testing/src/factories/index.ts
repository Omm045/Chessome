import { User } from '@chessome/types';

export class UserFactory {
  static createValidUser(overrides?: Partial<User>): User {
    return {
      id: 'usr_' + Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'test@example.com',
      username: 'testuser',
      preferences: {
        theme: 'system',
        boardStyle: 'classic',
        pieceSet: 'staunton',
        defaultEngineDepth: 20,
      },
      stats: {
        gamesImported: 0,
        gamesAnalyzed: 0,
        averageAccuracy: 0,
      },
      ...overrides,
    };
  }
}
