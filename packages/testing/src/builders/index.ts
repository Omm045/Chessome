import { GameMetadata } from '@chessome/types';

export class GameMetadataBuilder {
  private metadata: GameMetadata;

  constructor() {
    this.metadata = {
      white: 'Player 1',
      black: 'Player 2',
      date: new Date().toISOString(),
      result: '*',
    };
  }

  withPlayers(white: string, black: string): this {
    this.metadata.white = white;
    this.metadata.black = black;
    return this;
  }

  withResult(result: string): this {
    this.metadata.result = result;
    return this;
  }

  build(): GameMetadata {
    return { ...this.metadata };
  }
}
