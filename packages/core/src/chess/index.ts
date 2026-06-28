import { GameId, ValidationError, Result, ok, err } from '@chessome/shared';
import { GameMetadata } from '@chessome/types';
import { ITransaction } from '../shared';

export class FenString {
  private constructor(public readonly value: string) {}

  public static create(value: string): Result<FenString, ValidationError> {
    if (!value || value.trim().length === 0) {
      return err(new ValidationError('FEN string cannot be empty'));
    }
    return ok(new FenString(value));
  }
}

export class Game {
  private constructor(
    public readonly id: GameId,
    public readonly metadata: GameMetadata,
    public readonly currentFen: FenString,
    private readonly moves: string[]
  ) {}

  public static create(id: GameId, metadata: GameMetadata, startingFen: FenString): Result<Game, ValidationError> {
    if (metadata.result && !['1-0', '0-1', '1/2-1/2', '*'].includes(metadata.result)) {
      return err(new ValidationError('Invalid game result'));
    }
    return ok(new Game(id, metadata, startingFen, []));
  }

  public get moveCount(): number {
    return this.moves.length;
  }
  
  public get moveHistory(): readonly string[] {
    return this.moves;
  }
}

export interface IGameRepository {
  findById(id: GameId, tx?: ITransaction): Promise<Result<Game, Error>>;
  save(game: Game, tx?: ITransaction): Promise<Result<void, Error>>;
}
