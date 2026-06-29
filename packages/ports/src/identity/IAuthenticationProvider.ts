export interface AuthenticatedIdentity {
  providerId: string;
  email: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface IAuthenticationProvider {
  validateToken(token: string): Promise<AuthenticatedIdentity | null>;
}
