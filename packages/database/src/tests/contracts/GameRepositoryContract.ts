import { IGameRepository, Game, FenString } from '@chessome/core';
import { GameId } from '@chessome/shared';
// Note: Using a standard assertion library or custom test runner would normally happen here.
// This is the declarative contract that any IGameRepository must fulfill.

export class GameRepositoryContract {
  constructor(private readonly repository: IGameRepository) {}

  async testSaveAndRetrieve(): Promise<boolean> {
    const fenResult = FenString.create('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    if (!fenResult.isOk) throw new Error('Contract Setup Failed');
    
    const gameResult = Game.create('test-game-1' as GameId, { white: 'Alice', black: 'Bob', date: '2026-01-01', result: '1-0' }, fenResult.value);
    if (!gameResult.isOk) throw new Error('Contract Setup Failed');
    
    const game = gameResult.value;

    // 1. Save
    const saveResult = await this.repository.save(game);
    if (!saveResult.isOk) throw new Error('Repository failed to save valid aggregate');

    // 2. Retrieve
    const retrieveResult = await this.repository.findById(game.id);
    if (!retrieveResult.isOk) throw new Error('Repository failed to retrieve saved aggregate');
    
    // 3. Verify Mapping Integrity
    const retrievedGame = retrieveResult.value;
    if (retrievedGame.metadata.white !== 'Alice') throw new Error('Mapping corrupted data: white player');
    
    return true;
  }
}
