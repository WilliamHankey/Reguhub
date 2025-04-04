import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Container,
  CircularProgress
} from '@mui/material';
import { supabase } from '../utils/supabaseClient';

function Workers() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInviteWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // 2. Create the user in Supabase
      const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true
      });

      if (createError) throw createError;

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // 3. Create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: '', // Will be updated when they first login
          avatar_url: null,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // 4. Create magic link for the user
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email
      });

      if (linkError) throw linkError;

      // 5. Add to worker_invitations table
      const { error: inviteError } = await supabase
        .from('worker_invitations')
        .insert({
          email: email,
          status: 'pending',
          organization_id: 'current_org_id', // Replace with actual org ID
        });

      if (inviteError) throw inviteError;

      setSuccess('Worker invited successfully! They will receive an email with login instructions.');
      setEmail('');
    } catch (error: any) {
      console.error('Invitation error:', error);
      setError(error.message || 'Failed to invite worker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Invite Worker
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleInviteWorker}>
          <TextField
            fullWidth
            label="Worker Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Invite Worker'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Workers;
