import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://randtiovcslwvnxqlbts.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmR0aW92Y3Nsd3ZueHFsYnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDE4NjUsImV4cCI6MjA1ODUxNzg2NX0.UrR4ShwKlgN-1BfFrZCa2E8Luv7QLSoErKEZM4Xfb6c';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
}); 