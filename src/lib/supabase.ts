import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    (supabaseAnonKey || supabaseServiceKey)
  );
}

// Client for public operations (e.g. read catalog)
let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey);
  }
  return clientInstance;
}

// Server-side admin client for secure file uploads and private bucket streaming
let adminInstance: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Fallback to anon key if service role is not yet provided
    if (supabaseUrl && supabaseAnonKey) {
      return getSupabaseClient();
    }
    return null;
  }
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminInstance;
}
