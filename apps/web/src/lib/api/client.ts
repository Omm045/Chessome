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
  }
};
