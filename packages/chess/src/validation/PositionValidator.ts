import { Position } from '../position';

export interface PositionValidator {
  /**
   * Validates if a position is legal according to chess rules.
   */
  isValid(position: Position): boolean;
  validate(position: Position): void; // Throws error if invalid
}
