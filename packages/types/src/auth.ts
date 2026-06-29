export interface Session {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
