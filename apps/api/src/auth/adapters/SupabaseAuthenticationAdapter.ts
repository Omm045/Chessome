import { IAuthenticationProvider, AuthenticatedIdentity } from '@chessome/ports';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseAuthenticationAdapter implements IAuthenticationProvider {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseAuthenticationAdapter.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase URL or Key not found. Authentication will fail.');
    }

    this.supabase = createClient(
      supabaseUrl || 'http://localhost:54321', 
      supabaseKey || 'dummy_key'
    );
  }

  async validateToken(token: string): Promise<AuthenticatedIdentity | null> {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      
      if (error || !data.user) {
        this.logger.error(`Token validation failed: ${error?.message}`);
        return null;
      }

      const { user } = data;

      return {
        providerId: user.id,
        email: user.email || '',
        username: user.user_metadata?.username,
        displayName: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url
      };
    } catch (err) {
      this.logger.error('Unexpected error validating token', err);
      return null;
    }
  }
}
