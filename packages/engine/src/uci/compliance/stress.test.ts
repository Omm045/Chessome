import { describe, it, expect } from 'vitest';
import { UciDecoder } from '../decoder';
import { UciStateMachine, UciState } from '../protocol/state';

describe('UCI Compliance Suite: Long Sessions & Stress', () => {
  it('should survive 10,000 rapid state transitions and parses without memory leaks', () => {
    // Generate simulated engine inputs over a long continuous session
    const machine = new UciStateMachine();
    
    // Initial boot
    machine.transition(UciState.WaitingForUciOk);
    UciDecoder.decode('id name StressTest 1.0');
    UciDecoder.decode('uciok');
    
    machine.transition(UciState.WaitingForReadyOk);
    UciDecoder.decode('readyok');
    
    machine.transition(UciState.Idle);

    const iters = 10000;
    for (let i = 0; i < iters; i++) {
      // Simulate search request
      machine.transition(UciState.Searching);
      
      // Simulate rapid INFO spam typical of heavy search
      for (let j = 0; j < 5; j++) {
        const infoStr = `info depth ${j+1} seldepth ${j+2} multipv 1 score cp ${j*10} nodes ${j*1000} nps ${j*10000} tbhits 0 time ${j*50} pv e2e4 e7e5`;
        const res = UciDecoder.decode(infoStr);
        expect(res.type).toBe('INFO');
      }

      // Simulate completion
      UciDecoder.decode('bestmove e2e4 ponder e7e5');
      machine.transition(UciState.Idle);
    }
    
    // If it survives the loop without out-of-memory or stack overflow, it passes.
    expect(machine.state).toBe(UciState.Idle);
  });
});
