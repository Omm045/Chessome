import { ValidationError, Result, ok, err } from '@chessome/shared';

export class ECOCode {
  private constructor(public readonly value: string) {}

  public static create(value: string): Result<ECOCode, ValidationError> {
    if (!/^[A-E]\d{2}$/.test(value)) {
      return err(new ValidationError('Invalid ECO Code format'));
    }
    return ok(new ECOCode(value));
  }
}

export class Opening {
  private constructor(
    public readonly eco: ECOCode,
    public readonly name: string,
    public readonly fen: string
  ) {}

  public static create(eco: ECOCode, name: string, fen: string): Result<Opening, ValidationError> {
    return ok(new Opening(eco, name, fen));
  }
}

export interface IOpeningRepository {
  findByEco(eco: ECOCode): Promise<Result<Opening, Error>>;
}
