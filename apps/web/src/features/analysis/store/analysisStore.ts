import { create } from 'zustand';
import { AnalysisEventDto, PositionCompletedEventDto } from '@chessome/types';

export interface AnalysisState {
  // Session details
  sessionId: string | null;
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed';
  
  // Progress metrics
  currentPly: number;
  scrubPly: number | null; // For hovering the graph/move list
  
  // Real-time engine stats
  depth: number;
  nodes: number;
  nps: number;
  timeMs: number;
  currentPv: string[];
  
  // The aggregated report data
  evaluations: PositionCompletedEventDto[];
  
  // Actions
  setSession: (sessionId: string) => void;
  setStatus: (status: AnalysisState['status']) => void;
  setScrubPly: (ply: number | null) => void;
  
  // SSE Event Handler
  processEvent: (event: AnalysisEventDto) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  sessionId: null,
  status: 'idle' as const,
  currentPly: 0,
  scrubPly: null,
  depth: 0,
  nodes: 0,
  nps: 0,
  timeMs: 0,
  currentPv: [],
  evaluations: [],
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  ...initialState,
  
  setSession: (sessionId) => set({ sessionId, status: 'queued' }),
  setStatus: (status) => set({ status }),
  setScrubPly: (scrubPly) => set({ scrubPly }),
  
  processEvent: (event) => set((state) => {
    switch (event.type) {
      case 'PositionStarted':
        return { currentPly: event.ply, depth: 0, nodes: 0, nps: 0, currentPv: [] };
        
      case 'ProgressUpdated':
        return {
          currentPly: event.ply,
          depth: event.depth,
          nodes: event.nodes,
          nps: event.nps,
          timeMs: event.timeMs,
          currentPv: event.currentPv,
        };
        
      case 'PositionCompleted': {
        const newEvaluations = [...state.evaluations];
        newEvaluations[event.ply] = event;
        return { evaluations: newEvaluations };
      }
        
      case 'AnalysisCompleted':
        return { status: 'completed' };
        
      case 'AnalysisFailed':
        return { status: 'failed' };
        
      default:
        return state;
    }
  }),
  
  reset: () => set({ ...initialState }),
}));
