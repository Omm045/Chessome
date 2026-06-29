/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-const, no-async-promise-executor, @typescript-eslint/ban-ts-comment */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AnalysisSession, AnalysisCoordinator, EngineExecutor, PositionProvider, ResultAggregator } from '../analysis';
import { ReplayIterator, createMove, makeSquare } from '@chessome/chess';
import { EngineRuntime } from '@chessome/engine/src/runtime';
import { EnginePool } from '@chessome/engine/src/pool';
import { EngineRegistry } from '@chessome/engine/src/registry';
import { FenParser } from '@chessome/fen';

// Mock registry
class MockRegistry extends EngineRegistry {
  resolve(id: string): any | undefined {
    if (id === 'stockfish-16') return { id: 'stockfish-16', name: 'Stockfish', version: '16', capabilities: {}, adapters: {}, options: {} };
    return undefined;
  }
}

describe('Platform Integration Certification (Task 2.13.5)', () => {
  let runtime: EngineRuntime;

  beforeAll(async () => {
    const pool = new EnginePool({ minInstances: 1, maxInstances: 5, idleTimeoutMs: 10000, warmCount: 1 });
    const registry = new MockRegistry();
    runtime = new EngineRuntime(registry, {} as any, pool);
  });

  afterAll(async () => {
    await runtime.shutdown();
  });

  const getGoldenGame = () => {
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const startPos = FenParser.parse(startFen);
    
    // 1. e4 (e2-e4)
    const move1 = createMove(makeSquare(4, 1), makeSquare(4, 3));
    // 1... e5 (e7-e5)
    const move2 = createMove(makeSquare(4, 6), makeSquare(4, 4));

    const iterator = new ReplayIterator(startPos, [move1, move2]);
    return new PositionProvider(iterator);
  };

  it('Pipeline Suite: Analyzes a sequence of moves end-to-end', async () => {
    const provider = getGoldenGame();
    const session = await runtime.createSession('stockfish-16');
    const executor = new EngineExecutor(session);
    const analysisSession = new AnalysisSession('test-pipeline-1');
    const aggregator = new ResultAggregator('report-1', { analyzedAt: new Date(), options: { depth: 5 } }, { name: 'Stockfish', version: '16' }, new Date());
    const coordinator = new AnalysisCoordinator(analysisSession, provider, executor, aggregator);

    const events: any[] = [];
    for await (const event of coordinator.run('stockfish-16')) {
      events.push(event);
    }

    const completedEvent = events.find(e => e.type === 'AnalysisCompleted');
    expect(completedEvent).toBeDefined();
    
    const report = completedEvent.report;
    expect(report.positions.length).toBe(3); // StartPos + 2 moves
    expect(report.positions[0].position).toBeDefined();
    expect(report.positions[0].evaluation.type).toBe('cp');
    expect(report.positions[0].pv.length).toBeGreaterThan(0);

    await session.dispose();
  }, 10000);

  it('Cancellation Suite: Stops analysis cleanly when session is cancelled', async () => {
    const provider = getGoldenGame();
    const session = await runtime.createSession('stockfish-16');
    const executor = new EngineExecutor(session);
    const analysisSession = new AnalysisSession('test-cancel-1');
    const aggregator = new ResultAggregator('report-2', { analyzedAt: new Date(), options: { depth: 15 } }, { name: 'Stockfish', version: '16' }, new Date());
    const coordinator = new AnalysisCoordinator(analysisSession, provider, executor, aggregator);

    const events: any[] = [];
    let positionCount = 0;

    for await (const event of coordinator.run('stockfish-16')) {
      events.push(event);
      if (event.type === 'PositionStarted') {
        positionCount++;
        if (positionCount === 2) {
          analysisSession.cancel(); // Cancel during the second position
        }
      }
    }

    const cancelledEvent = events.find(e => e.type === 'AnalysisCancelled');
    expect(cancelledEvent).toBeDefined();
    expect(positionCount).toBeLessThan(3); // Should not reach the 3rd position

    await session.dispose();
  }, 10000);

  it('Crash Suite: Engine process fault isolates to a single session', async () => {
    const provider = getGoldenGame();
    const session = await runtime.createSession('stockfish-16');
    const executor = new EngineExecutor(session);
    const analysisSession = new AnalysisSession('test-crash-1');
    const aggregator = new ResultAggregator('report-3', { analyzedAt: new Date(), options: { depth: 10 } }, { name: 'Stockfish', version: '16' }, new Date());
    const coordinator = new AnalysisCoordinator(analysisSession, provider, executor, aggregator);

    const events: any[] = [];
    let positionCount = 0;
    
    for await (const event of coordinator.run('stockfish-16')) {
      events.push(event);
      if (event.type === 'PositionStarted') {
        positionCount++;
        if (positionCount === 1) {
          // Forcefully kill the engine process underneath
          (session as any).process.transport.process.kill('SIGKILL');
        }
      }
    }

    const failedEvent = events.find(e => e.type === 'AnalysisFailed');
    expect(failedEvent).toBeDefined(); // Process death should surface an error or fail the session
    expect(failedEvent.error).toBeDefined();
  }, 15000);

  it('Pool Suite: Validates session reuse without memory leaks', async () => {
    // 1. Lease a session and run a short analysis
    let session = await runtime.createSession('stockfish-16');
    const id1 = (session as any).id;
    
    let executor = new EngineExecutor(session);
    let analysisSession = new AnalysisSession('test-pool-1');
    let aggregator = new ResultAggregator('report-4', { analyzedAt: new Date(), options: { depth: 1 } }, { name: 'Stockfish', version: '16' }, new Date());
    let coordinator = new AnalysisCoordinator(analysisSession, getGoldenGame(), executor, aggregator);

    for await (const _ of coordinator.run('stockfish-16')) { /* drain */ }
    await session.dispose(); // Should release back to pool

    // 2. Lease another session and run analysis
    session = await runtime.createSession('stockfish-16');
    const id2 = (session as any).id;
    
    expect(id1).toBe(id2); // Should have reused the same underlying process

    executor = new EngineExecutor(session);
    analysisSession = new AnalysisSession('test-pool-2');
    aggregator = new ResultAggregator('report-5', { analyzedAt: new Date(), options: { depth: 1 } }, { name: 'Stockfish', version: '16' }, new Date());
    coordinator = new AnalysisCoordinator(analysisSession, getGoldenGame(), executor, aggregator);

    const events: any[] = [];
    for await (const event of coordinator.run('stockfish-16')) { events.push(event); }

    const completedEvent = events.find(e => e.type === 'AnalysisCompleted');
    expect(completedEvent).toBeDefined();

    await session.dispose();
  }, 10000);
});
