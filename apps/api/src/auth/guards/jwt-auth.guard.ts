import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Stub implementation: allow all for now until full auth is built
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Decode JWT here...
      const payload: JwtPayload = { sub: 'stub_user_id', email: 'stub@example.com', roles: ['user'] };
      request.user = payload;
      return true;
    }
    
    // For Milestone 2 we bypass strict auth checks, this is just scaffolding.
    // In production we would throw UnauthorizedException.
    request.user = { sub: 'guest', email: '', roles: [] };
    return true; 
  }
}
