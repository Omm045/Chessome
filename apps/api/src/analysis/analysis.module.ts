import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { LiveAnalysisService } from './live-analysis.service';

@Module({
  controllers: [AnalysisController],
  providers: [LiveAnalysisService],
})
export class AnalysisModule {}
