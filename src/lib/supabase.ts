import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avuwzqnrwkqypbepjfds.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dXd6cW5yd2txeXBiZXBqZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODQwODAsImV4cCI6MjA5MjI2MDA4MH0.z3aFpGY6puvTrcnprE4WYxnRwBX6GxBYiwmXIg41mRc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
