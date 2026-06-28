import { describe, it, expect } from 'vitest';
import { UciDecoder } from './index';

describe('UciDecoder', () => {
  it('should parse id name', () => {
    const result = UciDecoder.decode('id name Stockfish 16.1');
    expect(result).toEqual({ type: 'ID', idType: 'name', value: 'Stockfish 16.1' });
  });

  it('should parse id author', () => {
    const result = UciDecoder.decode('id author T. Romstad, M. Costalba, J. Kiiski, G. Linscott');
    expect(result).toEqual({ type: 'ID', idType: 'author', value: 'T. Romstad, M. Costalba, J. Kiiski, G. Linscott' });
  });

  it('should parse uciok', () => {
    const result = UciDecoder.decode('uciok');
    expect(result).toEqual({ type: 'UCIOK' });
  });

  it('should parse readyok', () => {
    const result = UciDecoder.decode('readyok');
    expect(result).toEqual({ type: 'READYOK' });
  });

  it('should parse option', () => {
    const result = UciDecoder.decode('option name Hash type spin default 16 min 1 max 33554432');
    expect(result).toEqual({
      type: 'OPTION',
      name: 'Hash',
      optionType: 'spin',
      default: '16',
      min: 1,
      max: 33554432
    });
  });

  it('should parse option combo with vars', () => {
    const result = UciDecoder.decode('option name UCI_Variant type combo default chess var chess var atomic var crazyhouse');
    expect(result).toEqual({
      type: 'OPTION',
      name: 'UCI_Variant',
      optionType: 'combo',
      default: 'chess',
      vars: ['chess', 'atomic', 'crazyhouse']
    });
  });

  it('should parse bestmove', () => {
    const result = UciDecoder.decode('bestmove e2e4');
    expect(result).toEqual({ type: 'BESTMOVE', bestMove: 'e2e4' });
  });

  it('should parse bestmove with ponder', () => {
    const result = UciDecoder.decode('bestmove e2e4 ponder e7e5');
    expect(result).toEqual({ type: 'BESTMOVE', bestMove: 'e2e4', ponder: 'e7e5' });
  });

  it('should parse basic info depth score cp', () => {
    const result = UciDecoder.decode('info depth 10 seldepth 14 multipv 1 score cp 33 nodes 12345 nps 54321 tbhits 0 time 123 pv e2e4 e7e5 g1f3');
    expect(result).toEqual({
      type: 'INFO',
      metrics: {
        depth: 10,
        seldepth: 14,
        multipv: 1,
        score: { type: 'cp', value: 33 },
        nodes: 12345,
        nps: 54321,
        tbhits: 0,
        time: 123,
        pv: ['e2e4', 'e7e5', 'g1f3']
      }
    });
  });

  it('should parse mate score', () => {
    const result = UciDecoder.decode('info depth 8 score mate 3 nodes 123 pv e2e4');
    expect(result).toEqual({
      type: 'INFO',
      metrics: {
        depth: 8,
        score: { type: 'mate', value: 3 },
        nodes: 123,
        pv: ['e2e4']
      }
    });
  });

  it('should handle info string', () => {
    const result = UciDecoder.decode('info string Node limit reached');
    expect(result).toEqual({
      type: 'INFO',
      metrics: { string: 'Node limit reached' }
    });
  });

  it('should gracefully handle unknown or malformed lines', () => {
    const result = UciDecoder.decode('some weird garbage');
    expect(result).toEqual({ type: 'UNKNOWN', raw: 'some weird garbage' });
  });
});
