import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  Grid, Box, Checkbox, FormControlLabel, IconButton, MenuItem, Avatar,
  Alert, CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

function CreateProjectModal() {
  const [open, setOpen] = useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    if (!projectData.image) {
      setUploadStatus({
        loading: false,
        error: 'Please select an image',
        success: false,
      });
      return;
    }

    setUploadStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      // First upload the image
      const formData = new FormData();
      formData.append('file', projectData.image);

      const fileResponse = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Then create the project with the image URL
      const projectResponse = await axios.post('http://localhost:5000/api/projects', {
        name: projectData.name,
        description: projectData.description,
        logo: fileResponse.data.url // Use the uploaded file's URL as the project logo
      });

      setUploadStatus({
        loading: false,
        error: null,
        success: true,
      });

      console.log('Project created successfully:', projectResponse.data);
      
      // Close the modal after a short delay to show the success message
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus({
        loading: false,
        error: 'Failed to create project. Please try again.',
        success: false,
      });
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Project
      </Button>

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
                <Alert severity="success">Image uploaded successfully!</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={uploadStatus.loading || !projectData.image}
          >
            {uploadStatus.loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateProjectModal;
