import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udbicidiodzncezlvwab.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkYmljaWRpb2R6bmNlemx2d2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODQxOTAsImV4cCI6MjA3ODk2MDE5MH0.QNZDBae3RKjs71MHnU93r7BsC9-hS7e2u6RdeJBCwPw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
