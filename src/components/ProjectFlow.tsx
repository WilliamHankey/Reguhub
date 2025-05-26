import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { EmptyState } from './ui/EmptyState';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface ProjectFlowItem {
  name: string;
  folder: number;
  files: string;
  status: string;
}

const ProjectFlow: React.FC = () => {
  const [projectFlowData, setProjectFlowData] = useState<ProjectFlowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/projectFlows')
      .then(response => setProjectFlowData(response.data))
      .catch(error => console.error('Error fetching project flow data:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Project Flow
      </Typography>
      
      {loading ? (
        <Typography>Loading project flow...</Typography>
      ) : projectFlowData.length === 0 ? (
        <EmptyState
          title="No Project Flow Data"
          description="Project flow information will be displayed here once projects are created and tasks are assigned."
          icon={<AccountTreeIcon sx={{ fontSize: 48 }} />}
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Folder</TableCell>
                <TableCell>Files</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectFlowData.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.folder}</TableCell>
                  <TableCell>{project.files}</TableCell>
                  <TableCell>{project.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ProjectFlow;
