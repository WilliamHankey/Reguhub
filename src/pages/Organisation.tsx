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
  Input,
  Grid,
  Divider,
  IconButton,
  Avatar,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import Header from '../components/Header';

interface FormData {
  companyName: string;
  businessRegNo: string;
  email: string;
  logo: File | null;
}

const PRIMARY_BLUE = '#1a237e';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
}));

const LogoUploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  border: `2px dashed ${PRIMARY_BLUE}`,
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': {
      borderColor: PRIMARY_BLUE,
    }
  }
}));

function Organisation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Logo must be an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      let logoUrl = null;

      if (formData.logo) {
        try {
          const fileExt = formData.logo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('organization-logos')
            .upload(fileName, formData.logo, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('organization-logos')
            .getPublicUrl(fileName);

          logoUrl = publicUrl;
        } catch (uploadError: any) {
          console.error('Error uploading logo:', uploadError);
          throw new Error('Failed to upload organization logo. Please try again.');
        }
      }

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
      setError('');
      console.log('RPC result:', result);
      if (result) {
        localStorage.setItem('organization_id', result);
        navigate('/workers');
      } else {
        console.error('Organization creation result missing or malformed:', result);
        setError('Organization creation failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating organization:', error);
      setError(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Container maxWidth="md" sx={{ pt: 8 }}>
          <Typography variant="h4">
            Create Your Organization
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Please fill out your organization's details
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
              {success}
            </Alert>
          )}
          <Divider sx={{ my: 2, mb:6 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
      
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Business Registration Number"
                      name="businessRegNo"
                      value={formData.businessRegNo}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Business Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} marginTop={4} >
                <input
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  style={{ display: 'none'}}
                  onChange={handleFileChange}
                />
                <label htmlFor="logo-upload">
                  <LogoUploadBox>
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                      />
                    ) : (
                      <Grid container justifyContent="center" alignItems="center">
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="subtitle1" color="primary" gutterBottom width="100%" align="center">
                          Upload Organization Logo
                        </Typography>
                        <Typography variant="caption" color="textSecondary" align="center" width="100%">
                          Drag and drop or click to upload
                          <br />
                          Max file size: 5MB
                        </Typography>
                      </Grid>
                    )}
                  </LogoUploadBox>
                </label>
                </Grid>
                
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/workers')}
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
                      'Create Organization'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
      </Container>
    </Box>
  );
}

export default Organisation;
