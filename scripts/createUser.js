const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'wchankey15@gmail.com',
      password: '123456',
      email_confirm: true // This automatically confirms the email
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('User created successfully:', data);

    // Create worker record
    const { error: workerError } = await supabase
      .from('workers')
      .insert([
        {
          id: data.user.id,
          full_name: 'William Chan',
          role: 'admin',
          department: 'Engineering'
        }
      ]);

    if (workerError) {
      console.error('Error creating worker record:', workerError.message);
      return;
    }

    console.log('Worker record created successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUser(); 