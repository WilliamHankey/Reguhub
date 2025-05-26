import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import WorkerCard from './WorkerCard';
import { EmptyState } from './ui/EmptyState';
// import { Button as AgButton } from 'agnostic-react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface Worker {
  avatar: string;
  name: string;
}

const OrganizationWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/workers')
      .then(response => setWorkers(response.data))
      .catch(error => console.error('Error fetching workers:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddWorker = () => {
    // Handle worker addition
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Organization Workers
      </Typography>
      
      {loading ? (
        <Typography>Loading workers...</Typography>
      ) : workers.length === 0 ? (
        <EmptyState
          title="No Workers Added"
          description="Start building your team by adding workers to your organization."
          icon={<PersonAddIcon sx={{ fontSize: 48 }} />}
          action={
            <Button variant="contained" onClick={handleAddWorker}>
              Add Worker
            </Button>
          }
        />
      ) : (
        <>
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
        </>
      )}
    </Box>
  );
};

export default OrganizationWorkers;
