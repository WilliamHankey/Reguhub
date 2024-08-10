import React, { useEffect, useState } from 'react';
import { 
    Typography, Button, Paper, Avatar, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, List, ListItem, ListItemAvatar, ListItemText, 
    Badge, Box, 
    Grid,
    Container,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    TextField
} from '@mui/material';
import { Search as SearchIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';


// const projects = [
//     { title: 'New Development', description: 'The population of wolf...', logo: '/static/images/avatar/1.jpg' },
//     // Add other projects as needed
//   ];
  
  const workers = [
    { name: 'John Soap', avatar: '/static/images/avatar/2.jpg', status: 'active' },
    // Add other workers as needed
  ];
  
  const projectFlow = [
    { project: 'BuildNoon - New Development', folder: 10, files: 6, status: 'Closed', workers: ['John', 'Doe', 'Smith'] },
    // Add other project flows as needed
  ];
  
  const logItems = [
    { title: 'Three-line item', description: 'Secondary line text lorem ipsum dapibus...', avatar: '/static/images/avatar/3.jpg' },
    // Add other log items as needed
  ];

  interface Project {
    title: string;
    description: string;
    logo: string;
  }
  
const Dashboard: React.FC = () => { 

    const [projects, setProjects] = useState<Project[]>([]);

   
    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const response = await axios.get<Project[]>('http://localhost:5000/projects');  // Adjust the URL as needed
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        };

        fetchProjects();
    }, []);
        
  const navigate = useNavigate();

  const handleNavigateToProjectIndex = () => {
    navigate('/projects');
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  return (
    <Box sx={{ flexGrow: 1 }}>
    
    <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        {/* Organization Projects */}
        <Grid item xs={12} lg={9}>
          <Typography variant="h4" gutterBottom>
            Organization Projects
          </Typography>
          <Button variant="contained" color="primary" sx={{ marginLeft: 2 }} onClick={handleClickOpen}>
              Create Project
            </Button>
            <Grid container spacing={2}>
            {projects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} onClick={handleNavigateToProjectIndex}>
                  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                    <Avatar alt={project.title} src={project.logo} sx={{ margin: 'auto', width: 60, height: 60 }} />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                      {project.description}
                    </Typography>
                    <Button size="small" sx={{ marginRight: 1 }}>Share</Button>
                    <Button size="small">Learn More</Button>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Grid>

        {/* Project Log */}
        <Grid item xs={12} lg={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Project Log
            </Typography>
            <List>
              {logItems.map((log, index) => (
                <ListItem alignItems="flex-start" key={index}>
                  <ListItemAvatar>
                    <Avatar alt={log.title} src={log.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={log.title}
                    secondary={log.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Organization Workers & Project Flow */}
        <Grid item xs={12} lg={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Organization Workers
            </Typography>
            <List>
              {workers.map((worker, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar alt={worker.name} src={worker.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={worker.name} />
                  <Badge color="success" variant="dot">
                    <AddCircleIcon />
                  </Badge>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Project Flow */}
        <Grid item xs={12} lg={9}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
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
                    <TableCell>Workers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectFlow.map((flow, index) => (
                    <TableRow key={index}>
                      <TableCell>{flow.project}</TableCell>
                      <TableCell>{flow.folder}</TableCell>
                      <TableCell>{flow.files}</TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" color={
                          flow.status === 'Closed' ? 'success' : flow.status === 'Pending' ? 'warning' : 'primary'
                        }>
                          {flow.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          {flow.workers.map((worker, idx) => (
                            <Avatar key={idx} alt={worker} src={`https://placehold.co/30x30?text=${worker}`} sx={{ marginRight: '-8px', border: '2px solid white' }} />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create a new Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                variant="outlined"
                fullWidth
                id="projectName"
                label="Project Name"
                name="projectName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="projectDescription"
                label="Project Description"
                name="projectDescription"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: 1,
                  padding: 2,
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                variant="outlined"
                fullWidth
                label="Workers"
                defaultValue="John Soap"
              >
                <MenuItem value="John Soap">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="John Soap"
                  />
                </MenuItem>
                <MenuItem value="Line item 3">
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Line item 3"
                  />
                </MenuItem>
                <MenuItem value="Line item 4">
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Line item 4"
                  />
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  </Box>
  );
}

export default Dashboard;
