import { IEnginePluginManifestV2 } from '@chessome/engine';

export const STOCKFISH_MANIFEST: IEnginePluginManifestV2 = {
  pluginId: 'org.stockfishchess.stockfish.native',
  engineId: 'stockfish',
  name: 'Stockfish',
  runtimeType: 'native',
  version: '16.1',
  license: 'GPL-3.0',
  author: 'T. Romstad, M. Costalba, J. Kiiski, G. Linscott',
  
  minRuntimeVersion: '1.0.0',
  supportedPlatforms: ['darwin-x64', 'darwin-arm64', 'linux-x64', 'linux-arm64', 'win32-x64'],
  
  autoUpdate: false,
  dependencies: {},
  
  binarySource: {
    type: 'github',
    url: 'https://github.com/official-stockfish/Stockfish/releases/download/sf_16.1/stockfish-macos-m1-apple-silicon.tar' // example
  },
  
  capabilities: {
    uciVersion: '1.0',
    supportsMultiPV: true,
    supportsSyzygy: true,
    supportsNNUE: true,
    supportsChess960: true,
    supportsVariants: [],
    supportsGPU: false,
    minThreads: 1,
    maxThreads: 1024,
    hashLimitMb: 33554432,
    customOptions: ['Skill Level', 'Move Overhead', 'Slow Mover', 'nodestime']
  }
};
