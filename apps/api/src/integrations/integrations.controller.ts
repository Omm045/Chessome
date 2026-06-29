import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('chesscom/games')
  async getChesscomGames(
    @Query('username') username: string,
    @Query('limit') limit: string = '20'
  ) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    
    const limitNum = parseInt(limit, 10) || 20;
    return this.integrationsService.fetchChesscomGames(username, limitNum);
  }

  @Get('lichess/games')
  async getLichessGames(
    @Query('username') username: string,
    @Query('limit') limit: string = '20'
  ) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    
    const limitNum = parseInt(limit, 10) || 20;
    return this.integrationsService.fetchLichessGames(username, limitNum);
  }
}
