import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://niyoepwsttuhfcylefpg.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yxvUTEUIinOct-6Y0zgoCA_eu-f7ZpA';

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
