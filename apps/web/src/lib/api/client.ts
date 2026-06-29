import { AnalyzeRequestDto, AnalysisCreatedResponseDto } from '@chessome/types';

const API_BASE = '/api/v1';

export const apiClient = {
  async startAnalysis(request: AnalyzeRequestDto): Promise<AnalysisCreatedResponseDto> {
    // For MVP testing, return a mock session if the API is not wired up completely
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
      return new Promise(resolve => setTimeout(() => {
        resolve({ sessionId: 'mock-session', status: 'queued', streamUrl: 'mock' });
      }, 500));
    }

    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to start analysis');
    }

    return res.json();
  }
};
