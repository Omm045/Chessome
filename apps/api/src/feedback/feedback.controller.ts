import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly prisma: PrismaClient) {}

  @Post()
  async submitFeedback(
    @Req() req: any,
    @Body() dto: { category: string; message: string; metadata?: any }
  ) {
    const user = req.user;
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
