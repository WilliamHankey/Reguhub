const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://randtiovcslwvnxqlbts.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmR0aW92Y3Nsd3ZueHFsYnRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjk0MTg2NSwiZXhwIjoyMDU4NTE3ODY1fQ.UrR4ShwKlgN-1BfFrZCa2E8Luv7QLSoErKEZM4Xfb6c';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

module.exports = supabase; 