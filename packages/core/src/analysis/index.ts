import { AnalysisId, GameId, ValidationError, Result, ok, err } from '@chessome/shared';
import { EngineName, EngineVersion } from '../engine';
import { ITransaction } from '../shared';

export class Depth {
  private constructor(public readonly value: number) {}

  public static create(value: number): Result<Depth, ValidationError> {
    if (value <= 0) {
      return err(new ValidationError('Depth must be greater than 0'));
    }
    return ok(new Depth(value));
  }
}

export class Analysis {
  private constructor(
    public readonly id: AnalysisId,
    public readonly gameId: GameId,
    public readonly depth: Depth,
    public readonly engine: EngineName,
    public readonly engineVersion: EngineVersion
  ) {}

  public static create(
    id: AnalysisId,
    gameId: GameId,
    depth: Depth,
    engine: EngineName,
    engineVersion: EngineVersion
  ): Result<Analysis, ValidationError> {
    return ok(new Analysis(id, gameId, depth, engine, engineVersion));
  }
}

export interface IAnalysisRepository {
  findById(id: AnalysisId, tx?: ITransaction): Promise<Result<Analysis, Error>>;
  save(analysis: Analysis, tx?: ITransaction): Promise<Result<void, Error>>;
}
