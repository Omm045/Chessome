import { Position } from '../position';
import { Move } from '../move';
import { ReplayState } from './ReplayState';

export class ReplayIterator implements IterableIterator<ReplayState> {
  private currentPly = 0;
  private currentPosition: Position;
  private lastMove: Move | null = null;
  private moveIndex = 0;

  constructor(
    private readonly startingPosition: Position,
    private readonly moves: readonly Move[]
  ) {
    this.currentPosition = startingPosition;
  }

  [Symbol.iterator](): IterableIterator<ReplayState> {
    return this;
  }

  next(): IteratorResult<ReplayState> {
    if (this.moveIndex > this.moves.length) {
      return { done: true, value: undefined };
    }

    const state: ReplayState = {
      ply: this.currentPly,
      position: this.currentPosition,
      lastMove: this.lastMove
    };

    if (this.moveIndex < this.moves.length) {
      const move = this.moves[this.moveIndex];
      this.currentPosition = this.currentPosition.apply(move);
      this.lastMove = move;
      this.currentPly++;
      this.moveIndex++;
    } else {
      // The final state has been yielded. Increment moveIndex to mark done on next call.
      this.moveIndex++;
    }

    return { done: false, value: state };
  }
}
