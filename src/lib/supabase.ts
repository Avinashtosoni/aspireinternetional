import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mhwszwdhyluraydnexyn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jZFjyR57wQumHEQ8pjFPRg_zZh8PMp0';

export const supabase = createClient(supabaseUrl, supabaseKey);

