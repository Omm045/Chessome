import { bench, describe } from 'vitest';
import { StockfishNativePlugin } from '../src';
import { UciStateMachine } from '@chessome/engine';

describe('Stockfish Plugin Benchmarks', () => {
  bench('Plugin Initialization', async () => {
    const plugin = new StockfishNativePlugin();
    await plugin.initialize();
    await plugin.dispose();
  });

  // Future benchmarks to add once the actual runtime process spans are implemented:
  // - Ready Time (UCI handshake)
  // - Nodes/sec
  // - MultiPV Scaling
  // - Memory Usage
  // - Restart Time
});
