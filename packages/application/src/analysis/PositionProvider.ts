import { ReplayIterator, ReplayState } from '@chessome/chess';

export class PositionProvider {
  constructor(private readonly replayIterator: ReplayIterator) {}

  /**
   * Fast-forwards the replay iterator to the specified ply.
   */
  public skipToPly(targetPly: number): void {
    for (const state of this.replayIterator) {
      if (state.ply >= targetPly) {
        break;
      }
    }
  }

  /**
   * Retrieves the remaining positions to analyze.
   */
  public *getRemainingPositions(): IterableIterator<ReplayState> {
    for (const state of this.replayIterator) {
      yield state;
    }
  }
}
