/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-const, no-async-promise-executor, @typescript-eslint/ban-ts-comment */
import { IEngineSession } from '@chessome/engine';

export class EngineExecutor {
  constructor(private readonly session: IEngineSession) {}

  public async evaluate(fen: string, depth: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let latestEval = {
        evaluation: { type: 'cp', value: 0 },
        depth: 0,
        pv: [] as string[],
        nodes: 0,
        nps: 0,
        timeMs: 0,
        hash: 0,
        tbHits: 0
      };

      const depthHandler = (e: any) => {
        latestEval.depth = e.depth;
      };

      const pvHandler = (e: any) => {
        if (e.scoreCp !== undefined) {
          latestEval.evaluation = { type: 'cp', value: e.scoreCp };
        } else if (e.scoreMate !== undefined) {
          latestEval.evaluation = { type: 'mate', value: e.scoreMate };
        }
        latestEval.pv = e.pv;
      };

      const bestMoveHandler = (e: any) => {
        cleanup();
        resolve(latestEval);
      };
      
      const errorHandler = (err: any) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        // @ts-ignore
        if (this.session.events.off) {
          // @ts-ignore
          this.session.events.off('Depth', depthHandler);
          // @ts-ignore
          this.session.events.off('PV', pvHandler);
          // @ts-ignore
          this.session.events.off('BestMove', bestMoveHandler);
          // @ts-ignore
          this.session.events.off('Failed', errorHandler);
        }
      };

      this.session.events.on('Depth', depthHandler);
      this.session.events.on('PV', pvHandler);
      this.session.events.on('BestMove', bestMoveHandler);
      this.session.events.on('Failed', errorHandler);

      try {
        await this.session.analyze(fen, { depth });
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  public async cancel(): Promise<void> {
    await this.session.cancel();
  }

  public async recover(): Promise<void> {
    // Restart logic is handled at the pool level or session level
    // We could ask the scheduler to replace the session here
  }
}
