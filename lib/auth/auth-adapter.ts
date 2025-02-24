import { createClient } from '@/utils/supabase/client';

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

class AuthAdapter {
  private static instance: AuthAdapter;
  private supabase = createClient();
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  private constructor() {
    // Initialize auth state listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email ?? undefined,
          username: session.user.user_metadata.username,
          fullName: session.user.user_metadata.full_name,
          avatarUrl: session.user.user_metadata.avatar_url,
        };
        this.notifyListeners(user);
      } else {
        this.notifyListeners(null);
      }
    });
  }

  public static getInstance(): AuthAdapter {
    if (!AuthAdapter.instance) {
      AuthAdapter.instance = new AuthAdapter();
    }
    return AuthAdapter.instance;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? undefined,
      username: user.user_metadata.username,
      fullName: user.user_metadata.full_name,
      avatarUrl: user.user_metadata.avatar_url,
    };
  }

  subscribe(callback: (user: AuthUser | null) => void) {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(user: AuthUser | null) {
    this.listeners.forEach(listener => listener(user));
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}

export const authAdapter = AuthAdapter.getInstance();
