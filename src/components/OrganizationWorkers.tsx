import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import WorkerCard from './WorkerCard';

interface Worker {
  avatar: string;
  name: string;
}

const OrganizationWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/workers')
      .then(response => setWorkers(response.data))
      .catch(error => console.error('Error fetching workers:', error));
  }, []);

  const handleAddWorker = () => {
    // Handle worker addition
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Organization Workers
      </Typography>
      <Grid container spacing={2}>
        {workers.map((worker, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WorkerCard worker={worker} />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddWorker}>
        Add Worker
      </Button>
    </Box>
  );
};

export default OrganizationWorkers;
