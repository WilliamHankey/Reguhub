import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  Grid, Box, IconButton, Avatar, Alert, CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onClose }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    image: null as File | null,
  });
  const [uploadStatus, setUploadStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClose = () => {
    // Reset form
    setProjectData({
      name: '',
      description: '',
      image: null,
    });
    setUploadStatus({
      loading: false,
      error: null,
      success: false,
    });
    setPreviewUrl(null);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectData(prev => ({
        ...prev,
        image: file
      }));
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    setUploadStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Get user's organization
      const { data: orgMember, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (orgError) throw new Error('Failed to get organization');
      if (!orgMember) throw new Error('No organization found');

      let imageUrl = null;
      if (projectData.image) {
        // Create unique file name with organization ID
        const fileExt = projectData.image.name.split('.').pop();
        const fileName = `${orgMember.organization_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('organization-logos')
          .upload(fileName, projectData.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('organization-logos')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create the project
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          image_url: imageUrl,
          organization_id: orgMember.organization_id,
          created_by: user.id,
          status: 'active'
        });

      if (projectError) throw projectError;

      setUploadStatus({
        loading: false,
        error: null,
        success: true,
      });

      // Close the modal after a short delay to show the success message
      setTimeout(handleClose, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      setUploadStatus({
        loading: false,
        error: error.message || 'Failed to create project. Please try again.',
        success: false,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create a new Project</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              id="projectName"
              label="Project Name"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              id="projectDescription"
              label="Project Description"
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: 1,
                padding: 2,
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={uploadStatus.loading}
              >
                Upload Project Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {previewUrl && (
                <Box mt={2}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      objectFit: 'contain' 
                    }} 
                  />
                </Box>
              )}
            </Box>
          </Grid>
          {uploadStatus.error && (
            <Grid item xs={12}>
              <Alert severity="error">{uploadStatus.error}</Alert>
            </Grid>
          )}
          {uploadStatus.success && (
            <Grid item xs={12}>
              <Alert severity="success">Project created successfully!</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploadStatus.loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={uploadStatus.loading || !projectData.name}
        >
          {uploadStatus.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create Project'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;
