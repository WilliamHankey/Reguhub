// src/components/WorkerCard.tsx
import React from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';

interface WorkerCardProps {
  worker: {
    avatar: string;
    name: string;
  };
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar src={worker.avatar} alt={worker.name} sx={{ mr: 2 }} />
        <CardContent>
          <Typography variant="h6">{worker.name}</Typography>
        </CardContent>
      </Box>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">Delete</Button>
      </CardActions>
    </Card>
  );
};

export default WorkerCard;
