import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://dukyxvvjvomgqwubsgcj.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5XgjOlgGdQzRNBxr6PMhQg_aLlgqI6w';

export const supabase = createClient(url, key);
