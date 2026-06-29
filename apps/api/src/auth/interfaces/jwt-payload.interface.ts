export interface JwtPayload {
  readonly sub: string; // userId
  readonly email: string;
  readonly roles: string[];
}
