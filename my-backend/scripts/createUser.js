const supabase = require('../config/supabase');

async function createUser() {
  try {
    // Create user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'wchankey15@gmail.com',
      password: '123456',
      email_confirm: true
    });

    if (userError) {
      console.error('Error creating user:', userError.message);
      return;
    }

    console.log('User created successfully:', userData);

    // Create worker record
    const { data: workerData, error: workerError } = await supabase
      .from('workers')
      .insert([
        {
          id: userData.user.id,
          full_name: 'William Chan',
          role: 'admin',
          department: 'Engineering'
        }
      ])
      .select()
      .single();

    if (workerError) {
      console.error('Error creating worker record:', workerError.message);
      return;
    }

    console.log('Worker record created:', workerData);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUser(); 