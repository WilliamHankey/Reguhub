const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://slydm6y.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNseWRtNnkiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzExNDE0NDI4LCJleHAiOjIwMjY5OTA0Mjh9.Wd_jqYz_LQZVzF0hHEQeQyGJQJWXoHKIGZ6_7TN8GQE'
);

async function createUser() {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'wchankey15@gmail.com',
      password: '123456',
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('User created successfully:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUser(); 