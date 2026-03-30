import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhwszwdhyluraydnexyn.supabase.co';
const supabaseKey = 'sb_publishable_jZFjyR57wQumHEQ8pjFPRg_zZh8PMp0';

export const supabase = createClient(supabaseUrl, supabaseKey);
