import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Chip } from '@mui/material';
import { Project } from '../types/project';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddIcon from '@mui/icons-material/Add';

interface ProjectOverviewWidgetProps {
  project: Project;
  onCreateTask?: () => void;
  onViewDetails?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return '#4caf50';
    case 'in progress':
      return '#2196f3';
    case 'on hold':
      return '#ff9800';
    default:
      return '#757575';
  }
};

export const ProjectOverviewWidget: React.FC<ProjectOverviewWidgetProps> = ({
  project,
  onCreateTask,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {project.name}
          </Typography>
          <Chip
            label={project.status}
            size="small"
            sx={{
              backgroundColor: getStatusColor(project.status),
              color: 'white',
            }}
          />
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center">
              <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                {project.tasksCount || 0} Tasks
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                {project.membersCount || 0} Members
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center">
              <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                {project.progress || 0}% Complete
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" mb={2} noWrap>
          {project.description}
        </Typography>

        <Box display="flex" justifyContent="space-between">
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={onCreateTask}
            variant="outlined"
          >
            Add Task
          </Button>
          <Button
            size="small"
            onClick={handleViewDetails}
            variant="contained"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectOverviewWidget; 