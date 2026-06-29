/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-const, no-async-promise-executor, @typescript-eslint/ban-ts-comment */
import { IUseCase } from '@chessome/ports';
import { Result, ok, err } from '@chessome/shared';
import { IGameRepository, Game } from '@chessome/core';

export interface ImportGameRequest {
  pgnText: string;
  userId: string;
}

export interface ImportGameResponse {
  gameId: string;
}

export class ImportGameUseCase implements IUseCase<ImportGameRequest, Result<ImportGameResponse, Error>> {
  constructor(
    private readonly gameRepo: IGameRepository
  ) {}

  async execute(request: ImportGameRequest): Promise<Result<ImportGameResponse, Error>> {
    // 1. Parse PGN
    // const parsedResult = await this.pgnParser.parse(request.pgnText);
    
    // 2. Create Game Domain Object
    // const game = Game.import(...);

    // 3. Save to DB
    // await this.gameRepo.save(game);
    
    // Stub implementation
    return ok({ gameId: 'temp_id' });
  }
}
