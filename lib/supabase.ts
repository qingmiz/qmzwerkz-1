import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hmxlzqirdfghlihgyynj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteGx6cWlyZGZnaGxpaGd5eW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjA1MDMsImV4cCI6MjEwMDI5NjUwM30.p5esFUDhbY8NXAYPBoY3TRBZmYwjjTCZ--IOh9SiNXg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);