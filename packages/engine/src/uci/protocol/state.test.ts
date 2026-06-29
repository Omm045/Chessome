import { describe, it, expect } from 'vitest';
import { UciStateMachine, UciState } from './state';
import { EngineStateError } from './errors';

describe('UciStateMachine', () => {
  it('should start at Starting state', () => {
    const sm = new UciStateMachine();
    expect(sm.state).toBe(UciState.Starting);
  });

  it('should transition correctly through standard boot sequence', () => {
    const sm = new UciStateMachine();
    sm.transition(UciState.WaitingForUciOk);
    expect(sm.state).toBe(UciState.WaitingForUciOk);
    sm.transition(UciState.WaitingForReadyOk);
    expect(sm.state).toBe(UciState.WaitingForReadyOk);
    sm.transition(UciState.Idle);
    expect(sm.state).toBe(UciState.Idle);
  });

  it('should transition to searching and back to idle', () => {
    const sm = new UciStateMachine();
    sm.transition(UciState.WaitingForUciOk);
    sm.transition(UciState.WaitingForReadyOk);
    sm.transition(UciState.Idle);
    sm.transition(UciState.Searching);
    expect(sm.state).toBe(UciState.Searching);
    sm.transition(UciState.Idle);
    expect(sm.state).toBe(UciState.Idle);
  });

  it('should throw EngineStateError on invalid transition', () => {
    const sm = new UciStateMachine();
    expect(() => sm.transition(UciState.Searching)).toThrow(EngineStateError);
  });
});
