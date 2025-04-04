import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';

interface LogItem {
  title: string;
  description: string;
}

const ProjectLog: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/logs')
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Project Log
      </Typography>
      <List>
        {logs.map((log, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemText
              primary={log.title}
              secondary={log.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectLog;
