import { ValidationError, Result, ok, err } from '@chessome/shared';

export class FenString {
  private constructor(public readonly value: string) {}

  public static create(value: string): Result<FenString, ValidationError> {
    if (!value || value.trim().length === 0) {
      return err(new ValidationError('FEN string cannot be empty'));
    }
    // Basic FEN structure check could be added here if needed,
    // though the FEN parser will be doing strict validation anyway.
    return ok(new FenString(value));
  }
}
