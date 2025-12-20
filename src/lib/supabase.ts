import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehjvkszgyidkerornspx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoanZrc3pneWlka2Vyb3Juc3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTk2MDgsImV4cCI6MjA4MTU3NTYwOH0.Lt7CY2bzs9D9MTUbNu4iSEUa5e9DbcFD48uF9AfB4hg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
