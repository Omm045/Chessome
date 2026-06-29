import { IUseCase, IJobQueue, ICache } from '@chessome/ports';
import { GameId, Result, ok, err } from '@chessome/shared';
import { IGameRepository } from '@chessome/core';

export interface AnalyzeGameRequest {
  gameId: GameId;
  engineId: string;
  depth: number;
}

export interface AnalyzeGameResponse {
  jobId: string;
}

export class AnalyzeGameUseCase implements IUseCase<AnalyzeGameRequest, Result<AnalyzeGameResponse, Error>> {
  constructor(
    private readonly gameRepo: IGameRepository,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly analysisQueue: IJobQueue<any>,
    private readonly cache: ICache
  ) {}

  async execute(request: AnalyzeGameRequest): Promise<Result<AnalyzeGameResponse, Error>> {
    // 1. Fetch game
    const gameResult = await this.gameRepo.findById(request.gameId);
    if (!gameResult.isOk) return err(gameResult.error);

    // 2. Check cache (optional, could be done later in pipeline, but fast-fail is good)
    const cached = await this.cache.get(`analysis:${request.gameId}:${request.engineId}:${request.depth}`);
    if (cached) {
      // already analyzed?
    }

    // 3. Enqueue job
    const jobId = await this.analysisQueue.enqueue({
      jobId: `analyze_${request.gameId}_${Date.now()}`,
      deduplicationKey: `${request.gameId}:${request.engineId}:${request.depth}`,
      payload: request
    });

    return ok({ jobId });
  }
}
