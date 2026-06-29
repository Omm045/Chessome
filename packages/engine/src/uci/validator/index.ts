import { EngineResponse } from '../responses';
import { EngineParseError } from '../protocol/errors';

export class UciValidator {
  /**
   * Validate that a parsed response meets basic UCI invariants.
   * Ensures that we don't leak completely malformed structs into the runtime.
   */
  static validate(response: EngineResponse, strict = true): void {
    if (response.type === 'UNKNOWN') {
      if (strict) {
        throw new EngineParseError(`Received unknown protocol message: ${response.raw}`);
      }
      return; // Skip logging here since core logging is an external concern
    }

    if (response.type === 'OPTION') {
      if (!response.name || response.name.trim() === '') {
        throw new EngineParseError('Option is missing a valid name');
      }
      if (response.optionType === 'combo') {
        if (!response.vars || response.vars.length === 0) {
          throw new EngineParseError(`Combo option ${response.name} is missing vars`);
        }
      }
    }

    if (response.type === 'INFO') {
      const { metrics } = response;
      if (metrics.depth !== undefined && metrics.depth < 0) {
        throw new EngineParseError('Info depth cannot be negative');
      }
      if (metrics.multipv !== undefined && metrics.multipv < 1) {
        throw new EngineParseError('Info multipv must be at least 1');
      }
    }
  }
}
