import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';

interface ProjectFlowItem {
  name: string;
  folder: number;
  files: string;
  status: string;
}

const ProjectFlow: React.FC = () => {
  const [projectFlowData, setProjectFlowData] = useState<ProjectFlowItem[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/projectFlows')
      .then(response => setProjectFlowData(response.data))
      .catch(error => console.error('Error fetching project flow data:', error));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Project Flow
      </Typography>
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
    </Box>
  );
};

export default ProjectFlow;
