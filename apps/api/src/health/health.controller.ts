import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@chessome/database';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        } catch (e) {
          return { database: { status: 'down', message: e.message } };
        }
      },
      async () => {
        // Stub for Redis status until fully integrated
        return { redis: { status: 'up', message: 'Stubbed integration' } };
      }
    ]).then(result => ({
      ...result,
      meta: {
        version: process.env.npm_package_version || '0.5.0-alpha',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      }
    }));
  }
}
