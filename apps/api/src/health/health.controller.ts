import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import * as fs from 'fs';

@Controller('health')
export class HealthController {
  private redisClient: Redis | null = null;

  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaClient,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB heap limit (within 1GB machine)
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024), // 500MB RSS limit
      async () => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        } catch (e: any) {
          return { database: { status: 'down', message: e.message } };
        }
      },
      async () => {
        try {
          if (!this.redisClient && process.env.REDIS_URL) {
            this.redisClient = new Redis(process.env.REDIS_URL);
          }
          if (this.redisClient) {
            await this.redisClient.ping();
            return { redis: { status: 'up' } };
          }
          return { redis: { status: 'up', message: 'No REDIS_URL configured' } };
        } catch (e: any) {
          return { redis: { status: 'down', message: e.message } };
        }
      },
      async () => {
        const enginePath = 'packages/engine-stockfish/src/wasm/stockfish.js';
        if (fs.existsSync(enginePath)) {
          return { engine: { status: 'up', type: 'wasm' } };
        }
        return { engine: { status: 'down', message: 'Binary not found' } };
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
