import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxfoavatanqhbunqkgkv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Zm9hdmF0YW5xaGJ1bnFrZ2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDE3MDMsImV4cCI6MjA3ODcxNzcwM30.PDGQhmAJ1Je3abBu1Hq18z_X6YmIZpJsGSR6rew0SMU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
