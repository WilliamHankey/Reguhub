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
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import project1 from "../assests/projects/limebit.png";
import project2 from "../assests/projects/victorymetals.png";
import axios from 'axios';

interface Project {
    _id: string;
    name: string;
    description: string;
    logo: string;
    status: string;
    workers: Worker[];
    folders: Folder[];
    files: File[];
}

interface Folder {
    _id: string;
    name: string;
    project: string;
    files: string[];
} 

interface Worker {
    _id: string;
    name: string;
    avatar: string;
    status: string;
}

interface LogItem {
    title: string;
    description: string;
    avatar: string;
}

// Dummy Data
const dummyProjects: Project[] = [
    {
        _id: '1',
        name: 'Dummy Project 1',
        description: 'This is a fallback project description.',
        logo: project1, // Use the imported image directly
        status: 'Started',
        workers: [],
        folders: [],
        files: [],
    },
    {
        _id: '2',
        name: 'Dummy Project 2',
        description: 'This is another fallback project description.',
        logo: project2, // Use the imported image directly
        status: 'In Progress',
        workers: [],
        folders: [],
        files: [],
    },
];

const dummyWorkers: Worker[] = [
    {
        _id: '1',
        name: 'Dummy Worker 1',
        avatar: 'https://www.w3schools.com/howto/img_avatar.png',
        status: 'active',
    },
    {
        _id: '2',
        name: 'Dummy Worker 2',
        avatar: 'https://www.w3schools.com/w3images/avatar4.png',
        status: 'inactive',
    },
];

const dummyLogItems: LogItem[] = [
    {
        title: 'Dummy Log 1',
        description: 'This is a fallback log description.',
        avatar: 'https://www.w3schools.com/w3images/avatar1.png',
    },
    {
        title: 'Dummy Log 2',
        description: 'This is another fallback log description.',
        avatar: 'https://www.w3schools.com/w3images/avatar3.png',
    },
];

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [logItems, setLogItems] = useState<LogItem[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get<Project[]>('https://your-backend-url/projects');
                if (response.data.length > 0) {
                    setProjects(response.data);
                } else {
                    setProjects(dummyProjects); // Use dummy data if no data returned
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects(dummyProjects); // Use dummy data if there’s an error
            }
        };

        const fetchWorkers = async () => {
            try {
                const response = await axios.get<Worker[]>('https://your-backend-url/workers');
                if (response.data.length > 0) {
                    setWorkers(response.data);
                } else {
                    setWorkers(dummyWorkers); // Use dummy data if no data returned
                }
            } catch (error) {
                console.error('Error fetching workers:', error);
                setWorkers(dummyWorkers); // Use dummy data if there’s an error
            }
        };

        const fetchLogItems = async () => {
            try {
                const response = await axios.get<LogItem[]>('https://your-backend-url/logItems');
                if (response.data.length > 0) {
                    setLogItems(response.data);
                } else {
                    setLogItems(dummyLogItems); // Use dummy data if no data returned
                }
            } catch (error) {
                console.error('Error fetching log items:', error);
                setLogItems(dummyLogItems); // Use dummy data if there’s an error
            }
        };

        fetchProjects();
        fetchWorkers();
        fetchLogItems();
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
        <Box sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', padding: 0}}>
            <Container maxWidth={false} disableGutters={true}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={9} spacing={4} sx={{paddingTop: 0}}>
                        {/* Organization Projects */}
                        <Grid item xs={12} lg={12}>
                            <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                                <Grid container xs={12}>
                                    <Grid item xs={10} sm={8} md={9}>
                                        <Typography variant="h6" gutterBottom>
                                            Organization Projects
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="contained" color="primary" sx={{ marginLeft: 2 }} onClick={handleClickOpen}>
                                            Create Project
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ minHeight: '300px' }}>
                                    {projects.map((project) => (
                                        <Grid item xs={12} sm={6} md={3} key={project._id} onClick={handleNavigateToProjectIndex}>
                                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                                                <img 
                                                    alt={project.name} 
                                                    src={project.logo}
                                                    style={{ margin: 'auto', width: 100, height: 100, objectFit: 'contain' }} 
                                                />
                                                <Typography variant="h6" sx={{ marginTop: 2 }}>
                                                    {project.name}
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

                            </Paper>
                        </Grid>

                        <Grid container xs={12} spacing={2} sx={{ paddingTop: 2 }}>
                            <Grid item xs={12} sm={12} md={4}>
                                {/* Organization Workers */}
                                <Grid item xs={12} lg={12} sx={{ height: '100%' }}>
                                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Organization Workers
                                        </Typography>
                                        <List>
                                            {workers.map((worker) => (
                                                <ListItem key={worker._id}>
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
                            </Grid>

                            <Grid item xs={12} sm={12} md={8}>
                                {/* Project Flow */}
                                <Grid item xs={12} lg={12} sx={{ height: '100%' }}>
                                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Project Flow
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Project</TableCell>
                                                        <TableCell>Folders</TableCell>
                                                        <TableCell>Files</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Workers</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {projects.map((project) => (
                                                        <TableRow key={project._id}>
                                                            <TableCell>{project.name}</TableCell>
                                                            <TableCell>{project.folders.length}</TableCell>
                                                            <TableCell>{project.files.length}</TableCell>
                                                            <TableCell>
                                                                <Button size="small" variant="contained" color={
                                                                    project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'warning' : 'primary'
                                                                }>
                                                                    {project.status}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex' }}>
                                                                    {project.workers.map((worker, idx) => (
                                                                        <Avatar key={idx} alt={worker.name} src={worker.avatar} sx={{ marginRight: '-8px', border: '2px solid white' }} />
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
                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        {/* Project Log */}
                        <Grid item xs={12} lg={12} sx={{ height: '100%' }}>
                            <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
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
                                    defaultValue={workers.length > 0 ? workers[0].name : ''}
                                >
                                    {workers.map((worker) => (
                                        <MenuItem key={worker._id} value={worker.name}>
                                            <FormControlLabel
                                                control={<Checkbox defaultChecked />}
                                                label={worker.name}
                                            />
                                        </MenuItem>
                                    ))}
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
