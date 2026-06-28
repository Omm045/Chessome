import { ValidationError, Result, ok, err, EngineId } from '@chessome/shared';

export class EngineName {
  private constructor(public readonly value: string) {}
  public static create(value: string): Result<EngineName, ValidationError> {
    if (!value) return err(new ValidationError('Engine name required'));
    return ok(new EngineName(value));
  }
}

export class EngineVersion {
  private constructor(public readonly value: string) {}
  public static create(value: string): Result<EngineVersion, ValidationError> {
    if (!value) return err(new ValidationError('Engine version required'));
    return ok(new EngineVersion(value));
  }
}

export class Engine {
  private constructor(
    public readonly id: EngineId,
    public readonly name: EngineName,
    public readonly version: EngineVersion
  ) {}

  public static create(id: EngineId, name: EngineName, version: EngineVersion): Result<Engine, ValidationError> {
    return ok(new Engine(id, name, version));
  }
}

export interface IEngineRepository {
  findById(id: EngineId): Promise<Result<Engine, Error>>;
}
