import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Supabase ≥ 2025 emite PUBLISHABLE_KEY; versiones anteriores usaban ANON_KEY
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl !== 'https://tu-proyecto-supabase.supabase.co' &&
  Boolean(supabaseKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
