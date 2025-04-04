import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // This is where you would fetch project details from Supabase using the id
  const project = {
    name: 'Construction Site A',
    description: 'Major construction project in downtown area',
    status: 'In Progress',
    startDate: '2024-03-15',
    location: '123 Main Street',
    teamSize: 15,
    documents: [
      { name: 'Safety Protocol', type: 'PDF' },
      { name: 'Site Plans', type: 'DWG' }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {project.name}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography>
                {project.description}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Typography><strong>Status:</strong> {project.status}</Typography>
              <Typography><strong>Start Date:</strong> {project.startDate}</Typography>
              <Typography><strong>Location:</strong> {project.location}</Typography>
              <Typography><strong>Team Size:</strong> {project.teamSize} members</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              {project.documents.map((doc, index) => (
                <Typography key={index}>
                  • {doc.name} ({doc.type})
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProjectDetails; 