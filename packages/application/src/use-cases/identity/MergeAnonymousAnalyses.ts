/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IUserRepository } from '@chessome/ports';
import { IGameRepository } from '@chessome/core';

export interface MergeAnonymousAnalysesRequest {
  userId: string;
  anonymousGameIds: string[];
}

export class MergeAnonymousAnalyses {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly gameRepository: IGameRepository
  ) {}

  async execute(request: MergeAnonymousAnalysesRequest): Promise<void> {
    const { userId, anonymousGameIds } = request;

    if (!anonymousGameIds || anonymousGameIds.length === 0) {
      return;
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    for (const gameId of anonymousGameIds) {
      // Cast the string to GameId alias since the port expects it
      // assuming GameId is a branded string or just a string alias
      const gameResult = await this.gameRepository.findById(gameId as any);
      if (gameResult.isOk) {
        const game = gameResult.value;
        if (!game.userId) { // Ensure it's not already owned
          game.attachToUser(userId);
          await this.gameRepository.save(game);
          
          if (user.statistics) {
            user.statistics.recordAnalysis(0);
          }
        }
      }
    }
    
    await this.userRepository.save(user);
  }
}
