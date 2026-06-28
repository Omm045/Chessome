export enum UciState {
  Starting = 'Starting',
  WaitingForUciOk = 'WaitingForUciOk',
  WaitingForReadyOk = 'WaitingForReadyOk',
  Idle = 'Idle',
  Searching = 'Searching',
  Stopped = 'Stopped',
  Exited = 'Exited'
}

import { EngineStateError } from './errors';

export class UciStateMachine {
  private _state: UciState = UciState.Starting;

  get state(): UciState {
    return this._state;
  }

  transition(to: UciState): void {
    const valid = this.isValidTransition(this._state, to);
    if (!valid) {
      throw new EngineStateError(`Invalid transition from ${this._state} to ${to}`);
    }
    this._state = to;
  }

  private isValidTransition(from: UciState, to: UciState): boolean {
    if (to === UciState.Exited) return true; // Can exit from anywhere

    switch (from) {
      case UciState.Starting:
        return to === UciState.WaitingForUciOk;
      case UciState.WaitingForUciOk:
        return to === UciState.WaitingForReadyOk;
      case UciState.WaitingForReadyOk:
        return to === UciState.Idle;
      case UciState.Idle:
        return to === UciState.Searching || to === UciState.WaitingForReadyOk; // Can re-initiate isready
      case UciState.Searching:
        return to === UciState.Stopped || to === UciState.Idle; // Stop command or natural completion
      case UciState.Stopped:
        return to === UciState.Idle || to === UciState.WaitingForReadyOk;
      case UciState.Exited:
        return false;
      default:
        return false;
    }
  }
}
