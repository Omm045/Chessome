import { AnalyzeRequestDto, AnalysisCreatedResponseDto } from '@chessome/types';

const API_BASE = '/api/v1';

export const apiClient = {
  async startAnalysis(request: AnalyzeRequestDto): Promise<AnalysisCreatedResponseDto> {
    const res = await fetch(`${API_BASE}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to start analysis');
    }

    return res.json();
  },

  async getHealth(): Promise<Record<string, unknown>> {
    const res = await fetch('/api/health', {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch health status');
    }

    return res.json();
  }
};
