export class CacheKeyBuilder {
  static analysis(gameId: string, engine: string, depth: number): string {
    return `analysis:${gameId}:${engine}:${depth}`;
  }

  static opening(fenHash: string): string {
    return `opening:${fenHash}`;
  }

  static evaluation(fenHash: string, depth: number): string {
    return `evaluation:${fenHash}:${depth}`;
  }

  static user(userId: string): string {
    return `user:${userId}`;
  }

  static study(studyId: string, version: number): string {
    return `study:${studyId}:v${version}`;
  }
}

