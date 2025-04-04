import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Input
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface FormData {
  companyName: string;
  businessRegNo: string;
  email: string;
  logo: File | null;
}

function Organisation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    businessRegNo: '',
    email: '',
    logo: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Logo must be an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      let logoUrl = null;

      // Handle logo upload if a file was selected
      if (formData.logo) {
        try {
          // Create unique file name
          const fileExt = formData.logo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          // Upload the file to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('organization-logos')
            .upload(fileName, formData.logo, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          // Get the public URL for the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('organization-logos')
            .getPublicUrl(fileName);

          logoUrl = publicUrl;
        } catch (uploadError: any) {
          console.error('Error uploading logo:', uploadError);
          throw new Error('Failed to upload organization logo. Please try again.');
        }
      }

      // Start a Supabase transaction using RPC
      const { data: result, error: rpcError } = await supabase.rpc('create_organization', {
        p_name: formData.companyName,
        p_business_reg_no: formData.businessRegNo,
        p_email: formData.email,
        p_logo_url: logoUrl,
        p_user_id: user.id
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        throw new Error('Failed to create organization. Please try again.');
      }

      setSuccess('Organization created successfully!');
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Error creating organization:', error);
      setError(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Your Organization
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

        <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            margin="normal"
              />

              <TextField
            fullWidth
            label="Business Registration Number"
            name="businessRegNo"
            value={formData.businessRegNo}
            onChange={handleInputChange}
                required
            margin="normal"
          />

          <TextField
                fullWidth
            label="Business Email"
                name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            margin="normal"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Organization Logo (Optional)
            </Typography>
            <Input
              type="file"
              inputProps={{
                accept: 'image/*'
              }}
              onChange={handleFileChange}
              fullWidth
            />
            <Typography variant="caption" color="textSecondary">
              Max file size: 5MB. Supported formats: PNG, JPEG, GIF
            </Typography>
              </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Organization'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Organisation;
