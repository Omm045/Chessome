import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '@chessome/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('v1/feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async submitFeedback(
    @CurrentUser() user: any,
    @Body() dto: { category: string; message: string; metadata?: any }
  ) {
    return this.prisma.userFeedback.create({
      data: {
        userId: user.userId,
        category: dto.category,
        message: dto.message,
        metadata: dto.metadata || {},
      },
    });
  }
}
