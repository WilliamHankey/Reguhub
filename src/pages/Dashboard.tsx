import React, { useEffect, useState } from 'react';
import { 
    Typography, Button, Paper, Avatar, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, List, ListItem, ListItemAvatar, ListItemText, 
    Badge, Box, 
    Grid,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    Card,
    CardContent,
    IconButton,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon, Image as ImageIcon, Description as DescriptionIcon, MoreVert as MoreVertIcon, Share as ShareIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import ResponsiveProjectFlow from '../components/ResponsiveProjectFlow';
import FullPageLoader from '../components/FullPageLoader';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
    id: string;
    name: string;
    description: string;
    image_url: string;
    created_at: string;
    organization_id?: string;
}

interface TeamMember {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    role: string;
}

interface Activity {
    id: string;
    description: string;
    created_at: string;
    user_name: string;
}

// Update the dummy projects array with more projects
const dummyProjects: Project[] = [
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Safety Management System',
        description: 'Comprehensive safety protocols and guidelines for construction sites.',
        image_url: '/images/projects/victorymetals.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Risk Assessment Framework',
        description: 'Standardized approach to identifying and mitigating workplace hazards.',
        image_url: '/images/projects/newfound.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Emergency Response Plan',
        description: 'Detailed procedures for handling workplace emergencies and incidents.',
        image_url: '/images/projects/victorymetals.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174003',
        name: 'Training Documentation',
        description: 'Employee safety training records and certification tracking system.',
        image_url: '/images/projects/reguhub_bg.jpg',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174004',
        name: 'Equipment Inspection',
        description: 'Regular safety inspections and maintenance records for equipment.',
        image_url: '/images/projects/limebit.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174005',
        name: 'Incident Reporting',
        description: 'System for reporting and investigating workplace incidents.',
        image_url: '/images/projects/newfound.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174006',
        name: 'PPE Management',
        description: 'Personal Protective Equipment inventory and distribution system.',
        image_url: '/images/projects/victorymetals.png',
        created_at: new Date().toISOString()
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174007',
        name: 'Safety Metrics Dashboard',
        description: 'Real-time monitoring of key safety performance indicators.',
        image_url: '/images/projects/reguhub_bg.jpg',
        created_at: new Date().toISOString()
    }
];

const dummyTeamMembers: TeamMember[] = [
    {
        id: '1',
        full_name: 'Dummy Worker 1',
        email: 'worker1@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        role: 'Admin'
    },
    {
        id: '2',
        full_name: 'Dummy Worker 2',
        email: 'worker2@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
        role: 'Worker'
    }
];

const dummyActivities: Activity[] = [
    {
        id: '1',
        description: 'Dummy Log 1',
        created_at: new Date().toISOString(),
        user_name: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
    },
    {
        id: '2',
        description: 'Dummy Log 2',
        created_at: new Date().toISOString(),
        user_name: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png'
    }
];

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Dialog states
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');

    const [openProjectDialog, setOpenProjectDialog] = useState(false);
    const [projectFormData, setProjectFormData] = useState({
        name: '',
        description: '',
        status: 'planning',
        imageFile: null as File | null,
        imagePreview: '' as string
    });
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectError, setProjectError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Add this dummy project
    const dummyProject: Project = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Construction Site A',
        description: 'Major construction project in downtown area',
        image_url: '',
        created_at: new Date().toISOString()
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (projects.length === 0 && !loading) {
            setProjects([dummyProject]);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            // Set dummy data if no real data is available
            if (projects.length === 0) {
                setProjects(dummyProjects);
            }
            if (teamMembers.length === 0) {
                setTeamMembers(dummyTeamMembers);
            }
            if (activities.length === 0) {
                setActivities(dummyActivities);
            }
        }
    }, [loading]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Get user's organization
            const { data: orgMember } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (orgMember) {
                // Fetch projects
                const { data: projectsData } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('organization_id', orgMember.organization_id)
                    .order('created_at', { ascending: false });

                // Fetch team members
                const { data: teamData } = await supabase
                    .from('organization_members')
                    .select(`
                        id,
                        profiles (
                            full_name,
                            email,
                            avatar_url
                        ),
                        role
                    `)
                    .eq('organization_id', orgMember.organization_id);

                // Fetch recent activities
                const { data: activitiesData } = await supabase
                    .from('activities')
                    .select(`
                        id,
                        description,
                        created_at,
                        profiles (full_name)
                    `)
                    .eq('organization_id', orgMember.organization_id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                setProjects(projectsData || []);
                
                // Map team data to TeamMember type
                const mappedTeamData = (teamData || []).map(member => ({
                    id: member.id,
                    full_name: member.profiles[0]?.full_name || '',
                    email: member.profiles[0]?.email || '',
                    avatar_url: member.profiles[0]?.avatar_url,
                    role: member.role
                }));
                setTeamMembers(mappedTeamData);

                // Map activities data to Activity type
                const mappedActivitiesData = (activitiesData || []).map(activity => ({
                    id: activity.id,
                    description: activity.description,
                    created_at: activity.created_at,
                    user_name: activity.profiles[0]?.full_name || ''
                }));
                setActivities(mappedActivitiesData);
            }
        } catch (error: any) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteMember = async () => {
        try {
            setInviting(true);
            setInviteError('');

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Get organization ID
            const { data: orgMember } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (!orgMember) throw new Error('No organization found');

            // Create invitation
            const { error: inviteError } = await supabase
                .from('worker_invitations')
                .insert([
                    {
                        organization_id: orgMember.organization_id,
                        email: inviteEmail,
                        status: 'pending'
                    }
                ]);

            if (inviteError) throw inviteError;

            // Close dialog and refresh data
            setInviteDialogOpen(false);
            setInviteEmail('');
            fetchDashboardData();
        } catch (error: any) {
            console.error('Error inviting member:', error);
            setInviteError(error.message);
        } finally {
            setInviting(false);
        }
    };

    const handleProjectDialogOpen = () => {
        setOpenProjectDialog(true);
    };

    const handleProjectDialogClose = () => {
        setOpenProjectDialog(false);
        setProjectFormData({
            name: '',
            description: '',
            status: 'planning',
            imageFile: null,
            imagePreview: ''
        });
        setProjectError(null);
    };

    const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectStatusChange = (e: any) => {
        setProjectFormData(prev => ({ ...prev, status: e.target.value }));
    };

    const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setProjectError('File size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setProjectError('File must be an image');
                return;
            }
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            
            setProjectFormData(prev => ({ 
                ...prev, 
                imageFile: file,
                imagePreview: previewUrl
            }));
            setProjectError(null);
        }
    };

    const handleCreateProject = async () => {
        setProjectLoading(true);
        setProjectError(null);
        setUploadSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('No user found');
            }

            // Get organization ID first
            const { data: orgMember, error: orgError } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (orgError) throw new Error('Failed to get organization');
            if (!orgMember) throw new Error('No organization found');

            let imageUrl = null;
            if (projectFormData.imageFile) {
                // Create a unique file name with timestamp and organization ID
                const fileExt = projectFormData.imageFile.name.split('.').pop();
                const fileName = `${orgMember.organization_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('organization-logos')
                    .upload(fileName, projectFormData.imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Get the public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('organization-logos')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
                setUploadSuccess(`Image "${projectFormData.imageFile.name}" uploaded successfully!`);
            }

            // Create the project with the image URL
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert([
                    {
                        name: projectFormData.name,
                        description: projectFormData.description,
                        status: projectFormData.status,
                        image_url: imageUrl,
                        organization_id: orgMember.organization_id,
                        created_by: user.id
                    }
                ])
                .select()
                .single();

            if (projectError) throw projectError;

            // Log activity
            await supabase
                .from('activities')
                .insert([
                    {
                        project_id: project.id,
                        user_id: user.id,
                        organization_id: orgMember.organization_id,
                        description: `Created project: ${projectFormData.name}`,
                        action: 'created'
                    }
                ]);

            // Update projects list and close dialog
            setProjects(prev => [...prev, project]);
            handleProjectDialogClose();
            
        } catch (err: any) {
            console.error('Project creation error:', err);
            setProjectError(err.message);
        } finally {
            setProjectLoading(false);
        }
    };

    const handleEditProject = async () => {
        if (!selectedProject) return;
        
        try {
            setEditError(null);
            
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            // Get user's organization
            const { data: orgMember, error: orgError } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (orgError) {
                console.error('Error fetching organization:', orgError);
                throw new Error('Failed to verify organization membership');
            }

            if (!orgMember) {
                throw new Error('You are not a member of any organization');
            }

            // First verify the project exists and belongs to the organization
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('organization_id', orgMember.organization_id)
                .eq('id', selectedProject.id)
                .single();

            if (projectError || !projectData) {
                console.error('Error fetching project:', projectError);
                throw new Error('Project not found or you do not have access to it');
            }

            // Update the project
            const { error: updateError } = await supabase
                .from('projects')
                .update({
                    name: selectedProject.name,
                    description: selectedProject.description,
                    image_url: selectedProject.image_url,
                    updated_at: new Date().toISOString(),
                    updated_by: user.id
                })
                .eq('id', selectedProject.id)
                .eq('organization_id', orgMember.organization_id);

            if (updateError) {
                console.error('Error updating project:', updateError);
                throw new Error('Failed to update project');
            }

            // Log activity
            try {
                await supabase
                    .from('activities')
                    .insert([
                        {
                            project_id: selectedProject.id,
                            user_id: user.id,
                            organization_id: orgMember.organization_id,
                            description: `Updated project: ${selectedProject.name}`,
                            action: 'updated'
                        }
                    ]);
            } catch (activityError) {
                console.error('Error logging activity:', activityError);
            }

            // Update local state and refresh data
            await fetchDashboardData();
            
            setEditDialogOpen(false);
            setSelectedProject(null);
            setEditError(null);
        } catch (error: any) {
            console.error('Error updating project:', error);
            setEditError(error.message);
        }
    };

    // Add animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    // Add this new component for image handling
    const ProjectImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
        const [error, setError] = useState(false);
        const [loading, setLoading] = useState(true);

        return (
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '160px',
                    bgcolor: 'background.default',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderRadius: 1
                }}
            >
                {loading && !error && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'background.default'
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}
                {error ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            Image not found
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={src}
                        alt={alt}
                        onError={() => setError(true)}
                        onLoad={() => setLoading(false)}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            ':hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                )}
            </Box>
        );
    };

    if (loading) {
        return <FullPageLoader />;
    }

    return (
        <Box sx={{ 
            p: 0,
            bgcolor: '#F4F4F4',
            minHeight: '100vh'
        }}>
            <Grid container spacing={3}>
                {/* Left Column - 75% */}
                <Grid item xs={12} lg={9}>
                    {/* First Row - Organization Projects */}
                    <Paper elevation={1} sx={{ 
                        p: 3, 
                        border: '1px solid #e0e0e0',
                        borderRadius: 0,
                        mb: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100vh - 35%)', 
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 3,
                            flexShrink: 0
                        }}>
                            <Typography variant="h6">Organization Projects</Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleProjectDialogOpen}
                                sx={{ borderRadius: 0 }}
                            >
                                Add Project
                                        </Button>
                        </Box>
                        <Box sx={{ 
                            overflow: 'auto',
                            flex: 1,
                            margin: '-8px'
                        }}>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Grid container spacing={2} overflow="auto">
                                    {projects.map((project) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} rowSpacing={0.5} key={project.id}>
                                            <motion.div variants={itemVariants}>
                                                <Paper elevation={1} sx={{ 
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    position: 'relative'
                                                }}>
                                                    <IconButton 
                                                        size="small"
                                                        sx={{ 
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                        }}
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>

                                                    <Box sx={{ mb: 2 }}>
                                                        <ProjectImage src={project.image_url} alt={project.name} />
                                                    </Box>
                                                    <Typography variant="h6" gutterBottom noWrap>
                                                    {project.name}
                                                </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary" 
                                                        sx={{ 
                                                            mb: 2,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}
                                                    >
                                                    {project.description}
                                                </Typography>
                                                    <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                                        <Button 
                                                            size="small" 
                                                            sx={{ 
                                                                textTransform: 'none',
                                                                borderRadius: 0
                                                            }}
                                                            onClick={() => navigate(`/safetyindex/${project.id}`)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Box>
                                            </Paper>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        </Box>
                            </Paper>

                    {/* Second Row - Workers and Flow */}
                    <Grid container spacing={3}>
                        {/* Organization Workers - 33% */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={1} sx={{ 
                                p: 3, 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 0,
                                height: 'calc(100vh - 85%)',
                                overflow: 'auto'
                            }}>
                                        <Typography variant="h6" gutterBottom>
                                            Organization Workers
                                        </Typography>
                                <List sx={{ pt: 0 }}>
                                    <AnimatePresence>
                                        {teamMembers.map((member) => (
                                            <motion.div
                                                key={member.id}
                                                variants={listItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                            >
                                                <ListItem 
                                                    disableGutters
                                                    secondaryAction={
                                                        <IconButton edge="end" size="small">
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar src={member.avatar_url || undefined} />
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={member.full_name}
                                                        primaryTypographyProps={{
                                                            variant: 'body2'
                                                        }}
                                                    />
                                                </ListItem>
                                            </motion.div>
                                            ))}
                                    </AnimatePresence>
                                        </List>
                                    </Paper>
                            </Grid>

                        {/* Project Flow - 67% */}
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Paper elevation={1} sx={{ 
                                    p: 3, 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: 0,
                                    height: 'calc(100vh - 85%)',
                                    overflow: 'auto'
                                }}>
                                        <Typography variant="h6" gutterBottom>
                                            Project Flow
                                        </Typography>
                                    <ResponsiveProjectFlow
                                        data={projects.map((project, index) => ({
                                            project: project.name,
                                            folders: 0,
                                            files: 0,
                                            status: index === 0 ? 'STARTED' : 'IN PROGRESS',
                                            workers: teamMembers.length
                                        }))}
                                    />
                                    </Paper>
                            </motion.div>
                        </Grid>
                        </Grid>
                    </Grid>

                {/* Right Column - Project Log 25% */}
                <Grid item xs={12} lg={3} >
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper elevation={1} sx={{ 
                            p: 3, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 0,
                            height: 'calc(100vh - 11%)',
                            overflow: 'auto'
                        }}>
                                <Typography variant="h6" gutterBottom>
                                    Project Log
                                </Typography>
                            <List sx={{ pt: 0 }}>
                                <AnimatePresence>
                                    {activities.map((activity) => (
                                        <motion.div
                                            key={activity.id}
                                            variants={listItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        >
                                            <ListItem 
                                                disableGutters
                                            >
                                            <ListItemAvatar>
                                                    <Avatar src={activity.user_name} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                    primary={activity.description}
                                                    secondary={new Date(activity.created_at).toLocaleDateString()}
                                                    primaryTypographyProps={{
                                                        variant: 'body2'
                                                    }}
                                                    secondaryTypographyProps={{
                                                        variant: 'caption'
                                                    }}
                                            />
                                        </ListItem>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                </List>
                            </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Invite Member Dialog */}
            <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogContent>
                    {inviteError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {inviteError}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        disabled={inviting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInviteDialogOpen(false)} disabled={inviting}>
                        Cancel
                    </Button>
                    <Button onClick={handleInviteMember} disabled={inviting}>
                        {inviting ? <CircularProgress size={24} /> : 'Send Invitation'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Project Creation Dialog */}
            <Dialog open={openProjectDialog} onClose={handleProjectDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Create a new Project</DialogTitle>
                    <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {projectError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {projectError}
                            </Alert>
                        )}
                        {uploadSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {uploadSuccess}
                            </Alert>
                        )}
                                <TextField
                                    fullWidth
                                    label="Project Name"
                            name="name"
                            value={projectFormData.name}
                            onChange={handleProjectInputChange}
                            required
                            sx={{ mb: 2 }}
                        />

                                <TextField
                                    fullWidth
                                    label="Project Description"
                            name="description"
                            value={projectFormData.description}
                            onChange={handleProjectInputChange}
                                    multiline
                                    rows={4}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" gutterBottom>
                                Project Cover Image
                            </Typography>
                            <Paper 
                                variant="outlined" 
                                    sx={{
                                    p: 2, 
                                        textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                                onClick={() => document.getElementById('project-image-input')?.click()}
                            >
                                        <input
                                    id="project-image-input"
                                            type="file"
                                            hidden
                                    accept="image/*"
                                    onChange={handleProjectFileChange}
                                />
                                {projectFormData.imagePreview ? (
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            component="img"
                                            src={projectFormData.imagePreview}
                                            alt="Preview"
                                            sx={{
                                                width: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'contain',
                                                mb: 2
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 0
                                            }}
                                        >
                                            Change Image
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 0
                                            }}
                                        >
                                            Upload Image
                                    </Button>
                                </Box>
                                )}
                            </Paper>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleProjectDialogClose}
                        sx={{ borderRadius: 0 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateProject}
                        disabled={projectLoading || !projectFormData.name}
                        sx={{ borderRadius: 0 }}
                    >
                        {projectLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                Creating...
                            </Box>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => {
                    setEditDialogOpen(false);
                    setSelectedProject(null);
                    setEditError(null);
                }}
            >
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, width: 400 }}>
                        {editError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {editError}
                            </Alert>
                        )}
                        <TextField
                            fullWidth
                            label="Project Name"
                            value={selectedProject?.name || ''}
                            onChange={(e) => setSelectedProject(prev => 
                                prev ? { ...prev, name: e.target.value } : null
                            )}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={selectedProject?.description || ''}
                            onChange={(e) => setSelectedProject(prev => 
                                prev ? { ...prev, description: e.target.value } : null
                            )}
                            sx={{ mb: 2 }}
                        />
                                <TextField
                                    fullWidth
                            label="Logo URL"
                            value={selectedProject?.image_url || ''}
                            onChange={(e) => setSelectedProject(prev => 
                                prev ? { ...prev, image_url: e.target.value } : null
                            )}
                        />
                    </Box>
                    </DialogContent>
                    <DialogActions>
                    <Button 
                        onClick={() => {
                            setEditDialogOpen(false);
                            setSelectedProject(null);
                            setEditError(null);
                        }}
                        sx={{ borderRadius: 0 }}
                    >
                            Cancel
                        </Button>
                    <Button 
                        variant="contained"
                        onClick={handleEditProject}
                        sx={{ borderRadius: 0 }}
                    >
                        Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
        </Box>
    );
};

export default Dashboard;
