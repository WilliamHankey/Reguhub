import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Button, 
    Paper, 
    Avatar, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Box, 
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    IconButton,
    CircularProgress,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    ListItemButton
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon, Image as ImageIcon, Description as DescriptionIcon, MoreVert as MoreVertIcon, Share as ShareIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import ResponsiveProjectFlow from '../components/ResponsiveProjectFlow';
import FullPageLoader from '../components/FullPageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';
import { EmptyState } from '../components/ui/EmptyState';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Header from '../components/Header';

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
    message: string;
}

const DEMO_EMAIL = 'demo@reguhub.com';

const DUMMY_PROJECTS = [
    {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Risk Assessment Framework',
        description: 'Standardized approach to identifying and mitigating workplace hazards.',
        image_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAHBhMSBxIVFhUVFRsYGBcXGBkbHhkZGB4aGhkhGR8dHSggGR8lHR8eJDIhJSkrLi8uGx8zOjMsNygtLisBCgoKDg0OGxAQGzUlICMtMi0vMy8vLjc3MjctLy0tLTUuLTArLS8tLTYtLTAuMC0tLTU1KzUtLSsvLTAtLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAwYEBQcCAQj/xABEEAABAwIDBAgDBAcFCQAAAAABAAIDBBEFEiEGEzFBByJRUmFxkdIygaEUFSOxM0JicoLB0TZjdJLhFiQlQ3N1k7Kz/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAKxEBAQACAQMBCAEFAQAAAAAAAAECEQMSITEEBSJBUXGRofCxIzKBwdET/9oADAMBAAIRAxEAPwDuKIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICLW4vj1JgrL4rPHFfgHOAJ8hxPyC59tl0rUrsFkZszK8zmwa/duaGi4zEZwLm17acSq3KTymY2upouXbH9K9I3BYmbSSvE7bh7925wdqcp6gNri19BrddAwjHaTGo82FTxygccjgSPMcR80mUvguNnlsURFZAiIgIiICIiAiIgIiICIiAiIgIiICIiIgIiIPEkgjYTIQABck8ABxuuSbS9ItVj+I/YtgmOcSbGYAXcBxLM3VYz+8d8raE/elPH5scxpmD4BqXOAmsfiJ62Qnk1res75DkQbbs5gUOyWHimwkB0zgHSzEak9p8OIaz/AFJw5OSYy23s0xx+6o4Z0VQw/jbZ1TpJHalrXHU9hebySHysrJS7NYNAA2mw1sni9jXH1mdmW5fRgdYXc/m52pP9PIWCpMu2zYdr20wDd1m3Rfz3p4c7Zb9Xhx1Xl5er5blrjx1HTOPGzvW/qtlMIqIyKjDRGO2NgafWF2ZVnE+iqOT8fYqqcyRuoY550PY17bPjP7wKvNTjdNSVkcVVK1skvwtPPlryFzoL2udAo5YrTXYS1wOjhoR/UeB0TL12WGrnNyonHvxdKXsx0j1OCYj9i29YWOFgJnAAtvwMltHN/vG6dt9SutseHtBYbgi4I4EHsVO2kwCLbHDDBiYDKhrS6KUD6jtbewcz/Qqr9FO0M2E4q/CNoLh7CRDc8C3UsB5tLes3wuOFgvU4uWZSWeK58sHW0RFuzEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k=',
        status: 'In Progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workers: ['1', '4']
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Emergency Response Plan',
        description: 'Detailed procedures for handling workplace emergencies and incidents.',
        image_url: 'data:image/png;base64,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',
        status: 'Completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workers: ['1','2']
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174003',
        name: 'Training Documentation',
        description: 'Employee safety training records and certification tracking system.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx-Ahrpf4mNkyIBrh9z25tUb32SZC9gYNUsg&s',
        status: 'On Hold',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workers: ['1','2', '3']
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174004',
        name: 'Training Documentation',
        description: 'Employee safety training records and certification tracking system.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx-Ahrpf4mNkyIBrh9z25tUb32SZC9gYNUsg&s',
        status: 'In Danger',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workers: ['2', '4']
    },
];
const DUMMY_TEAM_MEMBERS = [
    {
        id: '1',
        full_name: 'Amy Elsner',
        email: 'amyelsner@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        role: 'Admin',
    },
    {
        id: '2',
        full_name: 'Ioni Bowcher',
        email: 'ionibowcher@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
        role: 'Worker',
    },
    {
        id: '3',
        full_name: 'Onya Malimba',
        email: 'Onyamalimba@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
        role: 'Worker',
    },
    {
        id: '4',
        full_name: 'Xuxue Feng',
        email: 'xuxuefeng@example.com',
        avatar_url: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png',
        role: 'Worker',
    },
];
const DUMMY_ACTIVITIES = [
    {
        id: '1',
        description: 'Dummy Log 1',
        created_at: new Date().toISOString(),
        user_name: 'Amy Elsner',
        message: 'Amy added to organisation'
    },
    {
        id: '2',
        description: 'Dummy Log 2',
        created_at: new Date().toISOString(),
        user_name: 'Xuxue Feng',
        message: 'Xuxue uploaded regulations file to Risk Assessment Framework'
    },
];

const getProjectWorkers = (workerIds: (string | number)[], teamMembers: TeamMember[]) =>
    workerIds
      .map(id => {
        const tm = teamMembers.find(tm => tm.id === String(id));
        if (!tm) return undefined;
        // Ensure avatar_url is undefined if null
        return {
          ...tm,
          avatar_url: tm.avatar_url === null ? undefined : tm.avatar_url,
        };
      })
      .filter(Boolean) as { id: string; full_name: string; avatar_url?: string }[];

      

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState('');
    const searchLower = search.toLowerCase();
    const filteredProjects = projects.filter(
    (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.name && p.name.toLowerCase().includes(searchLower))
    );
    const filteredLogs = projects.filter(
    (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
    );
    const filteredWorkers = projects.filter(
    (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
    );

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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('Current user:', user);
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            // DEMO MODE: If demo user, inject dummy data and return
            if (user.email === DEMO_EMAIL) {
                setTeamMembers(DUMMY_TEAM_MEMBERS);
                const projectsWithWorkers = DUMMY_PROJECTS.map(project => ({
                  ...project,
                  workers: getProjectWorkers(project.workers || [], DUMMY_TEAM_MEMBERS)
                }));
                setProjects(projectsWithWorkers);
                setActivities(DUMMY_ACTIVITIES);
                setLoading(false);
                return;
            }

            // Get user's organization
            const { data: orgMember, error: orgError } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .maybeSingle();
            console.log('orgMember result:', orgMember);
            if (orgError) {
                console.error('orgMember query error:', orgError);
                throw orgError;
            }
            if (!orgMember) throw new Error('No organization found');

            // Fetch projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select(`
                    *,
                    members:project_members(count)
                `)
                .eq('organization_id', orgMember.organization_id)
                .order('created_at', { ascending: false });
            console.log('Fetched projectsData:', projectsData);
            if (projectsError) {
                console.error('projectsError:', projectsError);
                throw projectsError;
            }
            setProjects(projectsData?.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status || 'not started',
                image_url: project.image_url,
                organization_id: project.organization_id,
                tasksCount: project.tasks?.[0]?.count || 0,
                membersCount: project.members?.[0]?.count || 0,
                progress: project.progress || 0,
                createdAt: project.created_at,
                updatedAt: project.updated_at || project.created_at,
                created_by: project.created_by
            })) || []);

            // Fetch team members
            const { data: membersData, error: membersError } = await supabase
                .from('organization_member_profiles')
                .select('*')
                .eq('organization_id', orgMember.organization_id);
            console.log('Fetched membersData:', membersData);
            if (membersError) {
                console.error('membersError:', membersError);
                throw membersError;
            }
            setTeamMembers(membersData?.map(member => ({
                id: member.user_id,
                full_name: member.full_name || 'Unknown',
                email: member.email || '',
                avatar_url: member.avatar_url,
                role: member.role || 'Unknown'
            })) || []);

            // Fetch recent activities
            const { data: activitiesData, error: activitiesError } = await supabase
                .from('activity_profiles')
                .select('*')
                .eq('organization_id', orgMember.organization_id)
                .order('created_at', { ascending: false })
                .limit(10);
            console.log('Fetched activitiesData:', activitiesData);
            if (activitiesError) {
                console.error('activitiesError:', activitiesError);
                throw activitiesError;
            }
            setActivities(activitiesData?.map(activity => ({
                id: activity.id,
                description: activity.description,
                created_at: activity.created_at,
                user_name: activity.full_name || 'Unknown',
                message: activity.message || 'Unknown'
            })) || []);
        } catch (err: any) {
            console.error('fetchDashboardData error:', err);
            setError(err.message);
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
                .maybeSingle();
            console.log('Create Project - user:', user);
            console.log('Create Project - orgMember:', orgMember);

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

            // Prepare insert payload
            const insertPayload = {
                name: projectFormData.name,
                description: projectFormData.description,
                status: projectFormData.status,
                image_url: imageUrl,
                organization_id: orgMember.organization_id,
                created_by: user.id
            };
            console.log('Create Project - insert payload:', insertPayload);

            // Create the project with the image URL
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert([insertPayload])
                .select()
                .single();
            console.log('Create Project - result:', project, projectError);

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
            bgcolor: 'background.paper',
        }}>
            <Grid container>
                {/* Left Column - 75% */}
                <Grid item xs={12} lg={9}>
                    {/* First Row - Organization Projects */}
                    <Paper elevation={1} sx={{
                        p: 3,
                        border: '1px solid #e0e0e0',
                        borderRadius: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        minHeight: '53vh',
                        maxHeight: '54vh',
                    }}>
                        {/* <Header searchValue={search} onSearchChange={setSearch} /> */}
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
                            width: '100%',
                        }}>
                            {filteredProjects.length === 0 ? (
                                <Box sx={{ width: 'auto' }}>
                                    <EmptyState
                                        icon={<Inventory2Icon />}
                                        title="No Projects"
                                        description="Get started by creating your first project."
                                        action={
                                            <Button variant="contained" sx={{ borderRadius: 0 }} startIcon={<AddIcon />} onClick={handleProjectDialogOpen}>
                                                Add Project
                                            </Button>
                                        }
                                    />
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {filteredProjects.map((project: Project) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={project.id} display="flex">
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia
                                                    sx={{ height: 140, objectFit: 'contain' }}
                                                    image={project.image_url || ''}
                                                    title={project.name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                    {project.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {project.description}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button 
                                                        size="small" sx={{
                                                        textTransform: 'none',
                                                        borderRadius: 0
                                                        }}  
                                                        onClick={() => navigate(`/safetyindex/${project.id}`)}
                                                    >
                                                        Learn More
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                            {/* <Paper elevation={1} sx={{
                                                p: 2,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                width: '100%',
                                                minHeight: 220,
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
                                                    <img src={project.image_url || ''} alt={project.name || ''} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
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
                                            </Paper> */}
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Paper>
                    {/* Second Row - Workers and Flow */}
                    <Grid container>
                        {/* Organization Workers - 33% */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={1} sx={{ 
                                p: 3, 
                                border: '1px solid #e0e0e0', 
                                borderRadius: 0,
                                maxHeight: 'calc(100% - 15%)',
                                height: '100%',
                                overflow: 'auto'
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Organization Workers
                                </Typography>
                                <List sx={{ pt: 4 }}>
                                {teamMembers.length === 0 ? (
                                    <ListItem 
                                    disableGutters
                                    secondaryAction={
                                        <IconButton edge="end" size="small">
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemAvatar>
                                        <Avatar>i</Avatar>  
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary='No Workers'
                                        primaryTypographyProps={{
                                            variant: 'body2'
                                        }}
                                    />
                                    </ListItem>
                                        
                                    ) : (
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
                                                        secondary={member.role}
                                                        secondaryTypographyProps={{
                                                            variant: 'caption'
                                                        }}
                                                    />
                                                </ListItem>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    )}
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
                                    height: '100%', // Fill screen minus top bar
                                    // maxHeight: 'calc(100vh - 1%)', // Fill screen minus top bar
                                    minHeight: '37vh',
                                    maxHeight: '37vh',
                                    overflow: 'auto'
                                }}>
                                    <Typography variant="h6" gutterBottom>
                                        Project Flow
                                    </Typography>
                                    <ResponsiveProjectFlow
                                        projects={projects}
                                        onProjectClick={(id) => navigate(`/projects/${id}`)}
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
                            height: '100%', // Fill screen minus top bar
                            maxHeight: 'calc(100vh - 1%)', // Fill screen minus top bar
                            minHeight: 'calc(100vh - 81px)',
                            overflow: 'auto'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Project Log
                            </Typography>
                            <List sx={{ pt: 0 }}>
                                {activities.length === 0 ? (
                                    <ListItem 
                                        disableGutters
                                        divider
                                    >
                                        <ListItemAvatar>
                                                <Avatar>P</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary='No Project Logs'
                                                secondary='Project logs will appear here as your team works on projects.'
                                                primaryTypographyProps={{
                                                    variant: 'body2'
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'caption'
                                                }}                                  
                                          />
                                      </ListItem>
                                    
                                    ) : (
                                    <AnimatePresence>
                                        {activities.map((activity) => {
                                            const worker = teamMembers.find(tm => tm.full_name === activity.user_name);
                                            return (
                                            <motion.div
                                                key={activity.id}
                                                variants={listItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                            >
                                                <ListItem disableGutters dense>
                                                    <ListItemButton role={undefined}>
                                                        <ListItemAvatar>
                                                            <Avatar src={worker?.avatar_url || undefined}>
                                                            {!worker?.avatar_url && (activity.user_name?.charAt(0) || '?')}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={activity.message}
                                                            secondary={new Date(activity.created_at).toLocaleDateString()}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                            secondaryTypographyProps={{ variant: 'caption' }}

                                                        />
                                                        
                                                    </ListItemButton> 
                                                </ListItem>
                                            </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </List>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Dialogs */}
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
