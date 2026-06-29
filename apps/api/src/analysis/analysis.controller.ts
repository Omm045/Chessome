import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AnalyzeRequest } from './dto/analyze-request.dto';
import { AnalysisCreatedResponseDto, AnalysisEventDto, AnalysisReportDto } from '@chessome/types';

@Controller('v1/analysis')
export class AnalysisController {
  
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async startAnalysis(@Body() request: AnalyzeRequest): Promise<AnalysisCreatedResponseDto> {
    // Scaffold implementation
    const sessionId = 'mock-session-id';
    return {
      sessionId,
      status: 'queued',
      streamUrl: `/api/v1/analysis/${sessionId}/stream`
    };
  }

  @Sse(':sessionId/stream')
  streamAnalysis(@Param('sessionId') sessionId: string): Observable<{ data: AnalysisEventDto }> {
    // Scaffold implementation returning empty observable for now
    return new Observable();
  }

  @Get(':sessionId')
  async getAnalysisReport(@Param('sessionId') sessionId: string): Promise<AnalysisReportDto> {
    // Scaffold implementation
    return {
      sessionId,
      totalPositions: 0,
      evaluations: []
    };
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelAnalysis(@Param('sessionId') sessionId: string): Promise<void> {
    // Scaffold implementation
    return;
  }
}
