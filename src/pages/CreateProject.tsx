import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface FormData {
  name: string;
  description: string;
  status: string;
  imageFile: File | null;
}

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    status: 'planning',
    imageFile: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: any) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('No user found');
      }

      let imageUrl = null;
      if (formData.imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.imageFile);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        imageUrl = data.url;
      }

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            status: formData.status,
            image_url: imageUrl,
            created_by: user.data.user.id,
          },
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Log activity
      const { error: activityError } = await supabase
        .from('activities')
        .insert([
          {
            project_id: project.id,
            user_id: user.data.user.id,
            action: 'created',
            details: `Created project: ${formData.name}`,
          },
        ]);

      if (activityError) throw activityError;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Project
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              sx={{ mb: 2 }}
            >
              Upload Project Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {formData.imageFile && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: {formData.imageFile.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Project'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 