import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Container,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Workers() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const orgId = localStorage.getItem('organization_id');
    if (!orgId) {
      setError('No organization found. Please create an organization first.');
      return;
    }
    setOrganizationId(orgId);
  }, []);

  const handleInviteWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!organizationId) throw new Error('No organization found for this user.');
      // Directly insert into Supabase
      const { error: inviteError } = await supabase
        .from('worker_invitations')
        .insert([
          {
            email,
            organization_id: organizationId,
            status: 'pending'
          }
        ]);
      if (inviteError) throw inviteError;
      setSuccess('Worker invited successfully! They will receive an email with login instructions.');
      setEmail('');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Invitation error:', error);
      setError(error.message || 'Failed to invite worker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
    <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Typography variant="h4">
          Want to add your team?
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Invite them to your team to start, manage and complete projects together
        </Typography>

        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            {error.includes('No organization found') && (
              <Button variant="text" sx={{ ml: 2 }} onClick={() => navigate('/organisation')}>
                Create Organization
              </Button>
            )}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 2, mb:6 }} />

        <Box component="form" onSubmit={handleInviteWorker}>
          <TextField
            fullWidth
            label="john@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || !!error}
            sx={{ mb: 2 }}
          />
             <TextField
            fullWidth
            label="susan@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || !!error}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="tom@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || !!error}
            sx={{ mb: 2 }}
          />

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/dashboard')}
              >
                Skip
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                color='primary'
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Invite Worker'
                )}
              </Button>
            </Box>
          </Grid>
        </Box>
      </Container>
    </Box>

  );
}

export default Workers;
