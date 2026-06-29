'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnalysisWorkspace } from '../../../features/analysis/components/AnalysisWorkspace';
import { useAnalysisStream } from '../../../features/analysis/hooks/useAnalysisStream';
import { useAnalysisStore } from '../../../features/analysis/store/analysisStore';

export default function AnalyzePage() {
  const params = useParams();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  
  const { setSession, reset } = useAnalysisStore();

  // On mount, initialize the store with the session ID
  useEffect(() => {
    reset(); // Clear old analysis state
    if (sessionId) {
      setSession(sessionId);
    }
  }, [sessionId, setSession, reset]);

  // Hook handles the SSE connection internally via Zustand
  // If sessionId is "mock", it will spin up the mock stream generator.
  useAnalysisStream(sessionId === 'mock' ? 'mock' : sessionId ? `/api/v1/analysis/${sessionId}/stream` : null);

  return (
    <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
      <AnalysisWorkspace />
    </div>
  );
}
