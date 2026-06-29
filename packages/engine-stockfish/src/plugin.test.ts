import { describe, it, expect } from 'vitest';
import { StockfishNativePlugin, StockfishWasmPlugin } from './index';

describe('Stockfish Plugins', () => {
  it('Native plugin should manifest correctly', () => {
    const plugin = new StockfishNativePlugin();
    expect(plugin.manifest.pluginId).toBe('org.stockfishchess.stockfish.native');
    expect(plugin.manifest.name).toBe('Stockfish');
  });

  it('WASM plugin should manifest correctly', () => {
    const plugin = new StockfishWasmPlugin();
    expect(plugin.manifest.pluginId).toBe('org.stockfishchess.stockfish.wasm');
    expect(plugin.manifest.supportedPlatforms).toContain('wasm32');
  });
});
