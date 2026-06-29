import { Position, FenSerializer } from '@chessome/chess';

export class EnginePositionMapper {
  /**
   * Translates a Position aggregate into a FEN string for the engine.
   * In the future, this can be extended to support EPD or internal binary formats if supported by specific engines.
   */
  static toEngineFormat(position: Position): string {
    return FenSerializer.serialize(position);
  }
}
