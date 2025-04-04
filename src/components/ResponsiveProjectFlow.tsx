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
    Grid
} from '@mui/material';

interface ProjectFlowItem {
    project: string;
    folders: number;
    files: number;
    status: string;
    workers: number;
}

interface Props {
    data: ProjectFlowItem[];
}

const ResponsiveProjectFlow: React.FC<Props> = ({ data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getStatusColor = (status: string) => {
        return status === 'STARTED' ? 'primary' : 'warning';
    };

    if (isMobile) {
        return (
            <Grid container spacing={2}>
                {data.map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {item.project}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Folders
                                        </Typography>
                                        <Typography variant="body1">
                                            {item.folders}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Files
                                        </Typography>
                                        <Typography variant="body1">
                                            {item.files}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Workers
                                        </Typography>
                                        <Typography variant="body1">
                                            {item.workers}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell align="center">Folders</TableCell>
                        <TableCell align="center">Files</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Workers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.project}</TableCell>
                            <TableCell align="center">{item.folders}</TableCell>
                            <TableCell align="center">{item.files}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={item.status}
                                    color={getStatusColor(item.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="center">{item.workers}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResponsiveProjectFlow; 