/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, prefer-const, no-async-promise-executor, @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi } from 'vitest';
import { 
  AnalysisSession, 
  AnalysisCoordinator, 
  PositionProvider, 
  EngineExecutor, 
  ResultAggregator, 
  AnalysisMetadata, 
  EngineInfo 
} from '../analysis';
import { ReplayIterator, PositionBuilder, createMove } from '@chessome/chess';

// Mock dependencies
const mockEngineSession = {
  evaluate: vi.fn(),
  cancel: vi.fn(),
  recover: vi.fn()
};

describe('Analysis Pipeline Certification', () => {
  const createMockPosition = () => {
    return new PositionBuilder().build();
  };

  const createDependencies = () => {
    const session = new AnalysisSession('test-session-123');
    
    // We mock PositionProvider directly to avoid dealing with chess logic and FEN parsing
    const provider = new PositionProvider({} as any);
    
    // Simulate 4 states (start + 3 moves)
    const states = [
      { ply: 0, position: createMockPosition(), lastMove: null },
      { ply: 1, position: createMockPosition(), lastMove: createMove(12, 28) },
      { ply: 2, position: createMockPosition(), lastMove: createMove(52, 36) },
      { ply: 3, position: createMockPosition(), lastMove: createMove(6, 21) }
    ];
    
    let currentPlyIndex = 0;
    vi.spyOn(provider, 'skipToPly').mockImplementation((ply: number) => {
      currentPlyIndex = states.findIndex(s => s.ply >= ply);
      if (currentPlyIndex === -1) currentPlyIndex = states.length;
    });
    
    vi.spyOn(provider, 'getRemainingPositions').mockImplementation(function* () {
      for (let i = currentPlyIndex; i < states.length; i++) {
        yield states[i];
      }
    });

    const executor = new EngineExecutor(mockEngineSession as any);
    
    const metadata: AnalysisMetadata = { analyzedAt: new Date(), options: { depth: 20 } };
    const engineInfo: EngineInfo = { name: 'Stockfish', version: '16.1' };
    const aggregator = new ResultAggregator('report-1', metadata, engineInfo, new Date());
    
    return { session, provider, executor, aggregator };
  };

  it('Cancellation Certification', async () => {
    const { session, provider, executor, aggregator } = createDependencies();
    const coordinator = new AnalysisCoordinator(session, provider, executor, aggregator);
    
    // Simulate cancellation midway
    vi.spyOn(executor, 'evaluate').mockImplementation(async () => {
      session.cancel();
      return {
        evaluation: { type: 'cp', value: 50 },
        depth: 20,
        pv: [],
        nodes: 1000,
        nps: 1000,
        timeMs: 10,
        hash: 0,
        tbHits: 0
      };
    });

    const events = [];
    for await (const event of coordinator.run('stockfish:latest')) {
      events.push(event.type);
    }

    expect(events).toContain('AnalysisCancelled');
    expect(events).not.toContain('AnalysisCompleted');
    expect(session.cancelled).toBe(true);
  });

  it('Resumability Certification', async () => {
    const { session, provider, executor, aggregator } = createDependencies();
    
    // Simulate restoring from a checkpoint (ply 2)
    provider.skipToPly(2);
    
    const coordinator = new AnalysisCoordinator(session, provider, executor, aggregator);
    
    vi.spyOn(executor, 'evaluate').mockResolvedValue({
      evaluation: { type: 'cp', value: 30 },
      depth: 20,
      pv: [],
      nodes: 1000,
      nps: 1000,
      timeMs: 10,
      hash: 0,
      tbHits: 0
    });

    const events: any[] = [];
    for await (const event of coordinator.run('stockfish:latest')) {
      events.push(event);
    }

    // Since we skipped to ply 2, we only process ply 2 and 3 (2 positions out of 4 total including start)
    const startedEvents = events.filter(e => e.type === 'PositionStarted');
    expect(startedEvents.length).toBe(2);
    expect(startedEvents[0].ply).toBe(2);
    expect(startedEvents[1].ply).toBe(3);
  });

  it('Report Integrity Certification', async () => {
    const { session, provider, executor, aggregator } = createDependencies();
    const coordinator = new AnalysisCoordinator(session, provider, executor, aggregator);
    
    vi.spyOn(executor, 'evaluate').mockResolvedValue({
      evaluation: { type: 'cp', value: 45 },
      depth: 20,
      pv: [],
      nodes: 5000,
      nps: 500000,
      timeMs: 10,
      hash: 5,
      tbHits: 0
    });

    const events = [];
    for await (const event of coordinator.run('stockfish:latest')) {
      events.push(event);
    }

    const completedEvent = events.find(e => e.type === 'AnalysisCompleted') as any;
    expect(completedEvent).toBeDefined();
    
    const report = completedEvent.report;
    expect(report.summary.totalPositions).toBe(4); // Start pos + 3 moves
    expect(report.summary.averageDepth).toBe(20);
    expect(report.positions.length).toBe(4);
    
    // Check fields of the first evaluation
    const firstEval = report.positions[0];
    expect(firstEval.evaluation.value).toBe(45);
    expect(firstEval.engineId).toBe('stockfish:latest');
  });
});
