import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Card,
    CardContent,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Grid,
    Avatar,
    Stack
} from '@mui/material';
import { Project } from '../types/project';
import { EmptyState } from './ui/EmptyState';
import AddIcon from '@mui/icons-material/Add';

interface Props {
    projects: Project[];
    onProjectClick: (id: string) => void;
}

const ResponsiveProjectFlow: React.FC<Props> = ({ projects, onProjectClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in progress':
                return 'primary';
            case 'on hold':
                return 'warning';
            case 'in danger':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderWorkers = (workers: Project['workers'] = []) => {
        if (!workers.length) return null;

        const displayWorkers = workers.slice(0, 3);
        const remainingCount = workers.length - 3;

        return (
            <Stack direction="row" spacing={-1} alignItems="center">
                {displayWorkers.map((worker, index) => (
                    <Avatar
                        key={worker.id}
                        alt={worker.full_name}
                        src={worker.avatar_url || undefined}
                        sx={{
                            width: 32,
                            height: 32,
                            border: '2px solid white',
                            zIndex: displayWorkers.length - index,
                            '&:hover': {
                                zIndex: 10
                            }
                        }}
                    />
                ))}
                {remainingCount > 0 && (
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            border: '2px solid white',
                            zIndex: 1
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'white' }}>
                            +{remainingCount}
                        </Typography>
                    </Avatar>
                )}
            </Stack>
        );
    };

    if (isMobile) {
        return (
            <Grid container spacing={2} pt={4}>
                {projects.map((project) => (
                    <Grid item xs={12} key={project.id}>
                        <Card 
                            variant="outlined" 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => onProjectClick(project.id)}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {project.name}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Folders: {project.foldersCount || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Files: {project.filesCount || 0}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={project.status}
                                            color={getStatusColor(project.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Workers:
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            {renderWorkers(project.workers)}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                        <TableCell>Project</TableCell>
                        <TableCell>Folders</TableCell>
                        <TableCell>Files</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Workers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <EmptyState
                                    title="No Projects"
                                    description="Get started by creating your first project."
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project) => (
                            <TableRow 
                                key={project.id}
                                hover
                                onClick={() => onProjectClick(project.id)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>
                                    {project.name}
                                </TableCell>
                                <TableCell>
                                    {project.foldersCount || 0}
                                </TableCell>
                                <TableCell>
                                    {project.filesCount || 0}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={project.status}
                                        color={getStatusColor(project.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {renderWorkers(project.workers)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResponsiveProjectFlow; 