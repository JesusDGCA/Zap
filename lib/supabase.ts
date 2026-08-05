import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://tu-proyecto-supabase.supabase.co' &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu-anon-key-aqui';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
