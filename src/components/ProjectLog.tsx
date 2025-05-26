import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { EmptyState } from './ui/EmptyState';
import HistoryIcon from '@mui/icons-material/History';

interface LogItem {
  title: string;
  description: string;
}

const ProjectLog: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/logs')
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Project Log
      </Typography>
      
      {loading ? (
        <Typography>Loading logs...</Typography>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Activity Logs"
          description="Project activity logs will appear here as team members make changes and updates."
          icon={<HistoryIcon sx={{ fontSize: 48 }} />}
        />
      ) : (
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
      )}
    </Box>
  );
};

export default ProjectLog;
