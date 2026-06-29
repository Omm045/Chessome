import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AnalyzeRequest } from './dto/analyze-request.dto';
import { AnalysisCreatedResponseDto, AnalysisEventDto, AnalysisReportDto } from '@chessome/types';
import { LiveAnalysisService } from './live-analysis.service';

@Controller('v1/analysis')
export class AnalysisController {
  
  constructor(private readonly liveAnalysisService: LiveAnalysisService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async startAnalysis(@Body() request: AnalyzeRequest): Promise<AnalysisCreatedResponseDto> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Start the analysis in the background
    this.liveAnalysisService.startLiveAnalysis(sessionId, request);
    
    return {
      sessionId,
      status: 'queued',
      streamUrl: `/api/v1/analysis/${sessionId}/stream`
    };
  }

  @Sse(':sessionId/stream')
  streamAnalysis(@Param('sessionId') sessionId: string): Observable<{ data: AnalysisEventDto }> {
    return this.liveAnalysisService.getStream(sessionId);
  }

  @Get(':sessionId')
  async getAnalysisReport(@Param('sessionId') sessionId: string): Promise<AnalysisReportDto> {
    // Scaffold implementation for MVP
    return {
      sessionId,
      totalPositions: 0,
      evaluations: []
    };
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelAnalysis(@Param('sessionId') sessionId: string): Promise<void> {
    // TODO: implement cancellation
    return;
  }
}
