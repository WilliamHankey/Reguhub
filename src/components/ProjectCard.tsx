// src/components/ProjectCard.tsx
import React from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

interface ProjectCardProps {
  project: {
    logo: string;
    name: string;
    description: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={project.logo} alt={project.name} />
      <CardContent>
        <Typography variant="h6">{project.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
