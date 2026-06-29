/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-const, no-async-promise-executor, @typescript-eslint/ban-ts-comment */
import { AnalysisSession } from './AnalysisSession';
import { PositionProvider } from './PositionProvider';
import { EngineExecutor } from './EngineExecutor';
import { ResultAggregator } from './ResultAggregator';
import { EnginePositionMapper } from './EnginePositionMapper';
import { AnalysisEvent } from './AnalysisEvents';

export class AnalysisCoordinator {
  constructor(
    private readonly session: AnalysisSession,
    private readonly provider: PositionProvider,
    private readonly executor: EngineExecutor,
    private readonly aggregator: ResultAggregator
  ) {}

  public async *run(engineId: string): AsyncGenerator<AnalysisEvent, void, unknown> {
    yield { type: 'AnalysisStarted', sessionId: this.session.sessionId };

    try {
      for (const state of this.provider.getRemainingPositions()) {
        if (this.session.cancelled) {
          yield { type: 'AnalysisCancelled', sessionId: this.session.sessionId };
          await this.executor.cancel();
          return;
        }

        yield { type: 'PositionStarted', sessionId: this.session.sessionId, ply: state.ply };

        const fen = EnginePositionMapper.toEngineFormat(state.position);
        
        // Read depth option from aggregator metadata, default to 20 if missing
        const depth = this.aggregator.metadata.options?.depth || 20;
        const evalResult = await this.executor.evaluate(fen, depth);

        const posEval = {
          position: state.position,
          move: state.lastMove,
          evaluation: evalResult.evaluation,
          depth: evalResult.depth,
          pv: evalResult.pv,
          nodes: evalResult.nodes,
          nps: evalResult.nps,
          timeMs: evalResult.timeMs,
          hash: evalResult.hash,
          tbHits: evalResult.tbHits,
          engineId: engineId
        };

        this.aggregator.addEvaluation(posEval);
        this.session.updateCheckpoint(state.ply);

        yield { type: 'PositionCompleted', sessionId: this.session.sessionId, ply: state.ply, evaluation: posEval };
        yield { 
          type: 'ProgressUpdated', 
          sessionId: this.session.sessionId, 
          ply: state.ply, 
          totalPly: 100, // mock total
          depth: evalResult.depth, 
          engineState: 'busy', 
          elapsedMs: 100 
        };
      }

      const report = this.aggregator.buildReport();
      yield { type: 'AnalysisCompleted', sessionId: this.session.sessionId, report };
    } catch (err: any) {
      yield { type: 'AnalysisFailed', sessionId: this.session.sessionId, error: err };
    }
  }
}
