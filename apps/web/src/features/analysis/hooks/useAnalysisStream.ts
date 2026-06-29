import { useEffect } from 'react';
import { useAnalysisStore } from '../store/analysisStore';
import { AnalysisEventDto } from '@chessome/types';

export function useAnalysisStream(streamUrl: string | null) {
  const processEvent = useAnalysisStore((state) => state.processEvent);
  const setStatus = useAnalysisStore((state) => state.setStatus);

  useEffect(() => {
    if (!streamUrl) return;

    setStatus('running');
    
    // In a real environment, this connects to the NestJS SSE endpoint.
    // For this MVP UI iteration, we'll connect, but we also support a mock mode if the url is "mock".
    if (streamUrl === 'mock') {
      simulateMockStream(processEvent, setStatus);
      return;
    }

    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AnalysisEventDto;
        processEvent(data);
      } catch (err) {
        console.error('Failed to parse SSE event', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setStatus('failed');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [streamUrl, processEvent, setStatus]);
}

// A simple simulator for UI testing before backend integration is complete
function simulateMockStream(processEvent: (event: AnalysisEventDto) => void, setStatus: (status: 'running' | 'completed' | 'failed') => void) {
  let ply = 0;
  const maxPly = 20;

  const timer = setInterval(() => {
    if (ply > maxPly) {
      clearInterval(timer);
      processEvent({ type: 'AnalysisCompleted', reportUrl: '' });
      setStatus('completed');
      return;
    }

    // 1. Position started
    processEvent({ type: 'PositionStarted', ply });

    // 2. Simulate rapid progress updates (nodes, depth)
    let depth = 1;
    const progressTimer = setInterval(() => {
      if (depth > 18) {
        clearInterval(progressTimer);
        // 3. Position completed
        processEvent({
          type: 'PositionCompleted',
          ply,
          evaluation: { type: 'cp', value: Math.floor(Math.random() * 200) - 100 },
          bestMove: 'e2e4',
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          san: 'e4',
          classification: Math.random() > 0.8 ? 'good' : undefined
        });
        ply++;
      } else {
        processEvent({
          type: 'ProgressUpdated',
          ply,
          depth,
          nodes: depth * 15000,
          nps: 1200000,
          timeMs: depth * 100,
          currentPv: ['e2e4', 'e7e5', 'g1f3']
        });
        depth += 3;
      }
    }, 100);

  }, 1000); // 1 position per second
}
