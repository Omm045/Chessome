import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SupabaseAuthenticationAdapter } from './adapters/SupabaseAuthenticationAdapter';
import { PrismaUserRepository } from '@chessome/database';
import { PrismaClient } from '@prisma/client';
import { SyncUserIdentity } from '@chessome/application';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    // Prisma client instance (could be moved to a PrismaModule)
    {
      provide: PrismaClient,
      useValue: new PrismaClient()
    },
    // Repositories
    {
      provide: 'IUserRepository',
      useFactory: (prisma: PrismaClient) => new PrismaUserRepository(prisma),
      inject: [PrismaClient]
    },
    // Adapters
    {
      provide: 'IAuthenticationProvider',
      useClass: SupabaseAuthenticationAdapter
    },
    // Use Cases
    {
      provide: 'SyncUserIdentity',
      useFactory: (repo: any) => new SyncUserIdentity(repo),
      inject: ['IUserRepository']
    },
    // Guards
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
