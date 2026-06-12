import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_PUBLIC_ANON_KEY_HERE';

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
