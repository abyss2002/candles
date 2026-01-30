import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czgdlffhyvsyfnppxnbx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_j6e19WmusqTYTj_mumFi7A_v4GAKuNU';

export const supabase = createClient(supabaseUrl, supabaseKey);
