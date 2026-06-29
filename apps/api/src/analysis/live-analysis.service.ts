import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { AnalysisEventDto, AnalyzeRequestDto } from '@chessome/types';
import { AnalysisSession, AnalysisCoordinator, EngineExecutor, ResultAggregator, EnginePositionMapper } from '@chessome/application/dist/analysis';
import { EngineProcess } from '@chessome/engine/dist/processes/EngineProcess';
import { UciDecoder } from '@chessome/engine/dist/uci/decoder';
import { EventEmitter } from 'events';
import { Chess } from 'chess.js';

// Monkey-patch EnginePositionMapper for MVP since Position/FenSerializer is a stub in @chessome/chess
(EnginePositionMapper as any).toEngineFormat = (pos: any) => pos.fen;

// A simple adapter bridging Node's EngineProcess with IEngineSession
class UCIEngineSession {
  public readonly events = new EventEmitter();
  public isAnalyzing = false;
  
  constructor(public readonly id: string, private readonly process: EngineProcess) {
    this.process.transport.onMessage((line: string) => {
      const decoded = UciDecoder.decode(line);
      if (decoded.type === 'INFO' && decoded.metrics) {
        if (decoded.metrics.depth !== undefined) {
          this.events.emit('Depth', { depth: decoded.metrics.depth, seldepth: decoded.metrics.seldepth || 0 });
        }
        if (decoded.metrics.pv) {
          this.events.emit('PV', { 
            depth: decoded.metrics.depth || 0,
            scoreCp: decoded.metrics.score?.type === 'cp' ? decoded.metrics.score.value : undefined,
            scoreMate: decoded.metrics.score?.type === 'mate' ? decoded.metrics.score.value : undefined,
            pv: decoded.metrics.pv,
            multipv: decoded.metrics.multipv || 1,
            nodes: decoded.metrics.nodes,
            nps: decoded.metrics.nps,
            timeMs: decoded.metrics.time
          });
        }
      } else if (decoded.type === 'BESTMOVE') {
        this.events.emit('BestMove', { bestMove: decoded.bestMove, ponder: decoded.ponder });
      }
    });

    if (this.process.transport.onError) {
      this.process.transport.onError((err: Error) => {
        this.events.emit('Failed', { error: err.message });
      });
    }
  }

  async configure(options: any): Promise<void> {}

  async analyze(fen: string, searchParams: any): Promise<void> {
    this.isAnalyzing = true;
    await this.process.transport.send(`position fen ${fen}`);
    let goCommand = 'go';
    if (searchParams.depth) goCommand += ` depth ${searchParams.depth}`;
    await this.process.transport.send(goCommand);
  }

  async cancel(): Promise<void> {
    if (this.isAnalyzing) {
      await this.process.transport.send('stop');
      this.isAnalyzing = false;
    }
  }
}

// Dummy PositionProvider for MVP to yield chess.js parsed states
class MVPPositionProvider {
  constructor(private readonly chess: Chess) {}

  public *getRemainingPositions() {
    const history = this.chess.history({ verbose: true });
    // Also include start position
    const tempChess = new Chess();
    // Yield start position
    yield { ply: 0, position: { fen: tempChess.fen() }, lastMove: null };
    
    for (let i = 0; i < history.length; i++) {
      const move = history[i];
      tempChess.move(move);
      yield {
        ply: i + 1,
        position: { fen: tempChess.fen() },
        lastMove: { san: move.san }
      };
    }
  }
}

@Injectable()
export class LiveAnalysisService {
  private readonly logger = new Logger(LiveAnalysisService.name);
  
  // In-memory mapping of session IDs to RxJS Subjects
  private readonly streams = new Map<string, Subject<{ data: AnalysisEventDto }>>();

  /**
   * Returns the observable stream for a given sessionId.
   */
  public getStream(sessionId: string): Observable<{ data: AnalysisEventDto }> {
    if (!this.streams.has(sessionId)) {
      this.streams.set(sessionId, new Subject<{ data: AnalysisEventDto }>());
    }
    return this.streams.get(sessionId)!.asObservable();
  }

  /**
   * Triggers the end-to-end analysis workflow synchronously in the background.
   */
  public async startLiveAnalysis(sessionId: string, request: AnalyzeRequestDto): Promise<void> {
    if (!this.streams.has(sessionId)) {
      this.streams.set(sessionId, new Subject<{ data: AnalysisEventDto }>());
    }
    const subject = this.streams.get(sessionId)!;

    try {
      // 1. Parse PGN with chess.js for the MVP PositionProvider
      const chess = new Chess();
      if (request.type === 'pgn') {
        chess.loadPgn(request.data);
      } else {
        chess.load(request.data);
      }

      // 2. Build ReplayIterator & PositionProvider wrapper
      const positionProvider = new MVPPositionProvider(chess) as any;

      // 3. Setup Native Engine Process
      const engineProcess = new EngineProcess('stockfish');
      await engineProcess.spawn();
      
      const uciSession = new UCIEngineSession(sessionId, engineProcess);

      // 4. Setup Architecture layers
      const analysisSession = new AnalysisSession(sessionId);
      const engineExecutor = new EngineExecutor(uciSession as any);
      const resultAggregator = new ResultAggregator(
        sessionId,
        { engineId: 'stockfish', options: { depth: request.options?.depth || 15 } } as any,
        { id: 'stockfish', name: 'Stockfish', version: 'native' } as any,
        new Date()
      );

      const coordinator = new AnalysisCoordinator(
        analysisSession,
        positionProvider,
        engineExecutor,
        resultAggregator
      );

      // 5. Run the generator and pipe to Subject
      for await (const event of coordinator.run('stockfish')) {
        // Map backend AnalysisEvent to API AnalysisEventDto
        const dto = this.mapEventToDto(event);
        if (dto) {
          subject.next({ data: dto });
        }
      }

      // Cleanup
      await engineProcess.kill();
      setTimeout(() => this.streams.delete(sessionId), 5000); // Allow time for client to disconnect

    } catch (err: any) {
      this.logger.error(`Live analysis failed: ${err.message}`);
      subject.next({ data: { type: 'AnalysisFailed', error: err.message } });
      setTimeout(() => this.streams.delete(sessionId), 5000);
    }
  }

  private mapEventToDto(event: any): AnalysisEventDto | null {
    switch (event.type) {
      case 'AnalysisStarted':
      case 'AnalysisCancelled':
        return null;
        
      case 'PositionStarted':
        return { type: 'PositionStarted', ply: event.ply };
        
      case 'ProgressUpdated':
        return {
          type: 'ProgressUpdated',
          ply: event.ply,
          depth: event.depth,
          nodes: 0, 
          nps: 0,
          timeMs: event.elapsedMs,
          currentPv: [] 
        };
        
      case 'PositionCompleted':
        return {
          type: 'PositionCompleted',
          ply: event.ply,
          evaluation: {
            type: event.evaluation.evaluation.type,
            value: event.evaluation.evaluation.value
          },
          bestMove: event.evaluation.pv[0] || event.evaluation.move?.san || '',
          classification: undefined // Not implemented in engine yet
        };
        
      case 'AnalysisCompleted':
        return {
          type: 'AnalysisCompleted',
          reportUrl: `/api/v1/analysis/${event.sessionId}`
        };
        
      case 'AnalysisFailed':
        return {
          type: 'AnalysisFailed',
          error: event.error?.message || 'Unknown error'
        };
    }
    return null;
  }
}
