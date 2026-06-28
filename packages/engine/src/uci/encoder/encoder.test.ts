import { describe, it, expect } from 'vitest';
import { UciEncoder } from './index';

describe('UciEncoder', () => {
  it('should encode uci', () => {
    expect(UciEncoder.encode({ type: 'UCI' })).toBe('uci');
  });

  it('should encode isready', () => {
    expect(UciEncoder.encode({ type: 'IS_READY' })).toBe('isready');
  });

  it('should encode ucinewgame', () => {
    expect(UciEncoder.encode({ type: 'UCINEWGAME' })).toBe('ucinewgame');
  });

  it('should encode position startpos', () => {
    expect(UciEncoder.encode({ type: 'POSITION', fen: 'startpos' })).toBe('position startpos');
  });

  it('should encode position fen', () => {
    expect(UciEncoder.encode({ type: 'POSITION', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })).toBe('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });

  it('should encode position startpos with moves', () => {
    expect(UciEncoder.encode({ type: 'POSITION', fen: 'startpos', moves: ['e2e4', 'e7e5'] })).toBe('position startpos moves e2e4 e7e5');
  });

  it('should encode setoption', () => {
    expect(UciEncoder.encode({ type: 'SET_OPTION', name: 'Hash', value: 1024 })).toBe('setoption name Hash value 1024');
    expect(UciEncoder.encode({ type: 'SET_OPTION', name: 'UCI_AnalyseMode', value: true })).toBe('setoption name UCI_AnalyseMode value true');
  });

  it('should encode go infinite', () => {
    expect(UciEncoder.encode({ type: 'GO', searchParams: { infinite: true } })).toBe('go infinite');
  });

  it('should encode go depth nodes', () => {
    expect(UciEncoder.encode({ type: 'GO', searchParams: { depth: 20, nodes: 100000 } })).toBe('go depth 20 nodes 100000');
  });

  it('should encode go wtime btime', () => {
    expect(UciEncoder.encode({ type: 'GO', searchParams: { wtime: 15000, btime: 15000, winc: 100, binc: 100 } })).toBe('go wtime 15000 btime 15000 winc 100 binc 100');
  });

  it('should encode stop and quit', () => {
    expect(UciEncoder.encode({ type: 'STOP' })).toBe('stop');
    expect(UciEncoder.encode({ type: 'QUIT' })).toBe('quit');
  });
});
