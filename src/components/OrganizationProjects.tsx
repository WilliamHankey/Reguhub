import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import ProjectCard from './ProjectCard';

interface Project {
  logo: string;
  name: string;
  description: string;
}

const OrganizationProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleCreateProject = () => {
    // Handle project creation
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Organization Projects
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateProject}>
        Create Project
      </Button>
    </Box>
  );
};

export default OrganizationProjects;
