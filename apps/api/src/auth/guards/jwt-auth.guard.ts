import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { IAuthenticationProvider } from '@chessome/ports';
import { AuthProvider } from '@chessome/core';
import { SyncUserIdentity } from '@chessome/application';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('IAuthenticationProvider') private authProvider: IAuthenticationProvider,
    @Inject('SyncUserIdentity') private syncUserIdentity: SyncUserIdentity
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Validate token with provider (Supabase)
    const identity = await this.authProvider.validateToken(token);
    
    if (!identity) {
      throw new UnauthorizedException('Invalid token');
    }

    // 2. Just-In-Time sync the identity to the domain
    // We assume Supabase Auth as the default provider here since the token came from our Supabase setup
    const user = await this.syncUserIdentity.execute({
      identity,
      provider: AuthProvider.SUPABASE 
    });

    // 3. Attach the domain User object to the request
    request.user = user;
    
    return true;
  }
}
