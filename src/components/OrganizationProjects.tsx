import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Alert } from '@mui/material';
import ProjectOverviewWidget from './ProjectOverviewWidget';
import { Project } from '../types/project';
import CreateProjectModal from './CreateProjectModal';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../utils/supabaseClient';
import { EmptyState } from './ui/EmptyState';
// import { Button as AgButton } from 'agnostic-react';

const OrganizationProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

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

      if (orgError) throw orgError;
      if (!orgMember) throw new Error('No organization found');

      // Fetch projects with related data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          tasks:project_tasks(count),
          members:project_members(count)
        `)
        .eq('organization_id', orgMember.organization_id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Calculate progress for each project
      const projectsWithProgress = await Promise.all(projectsData.map(async (project) => {
        // Get completed tasks count
        const { count: completedCount, error: countError } = await supabase
          .from('project_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .eq('status', 'completed');

        if (countError) throw countError;

        const progress = project.tasks.count > 0
          ? Math.round((completedCount || 0) / project.tasks.count * 100)
          : 0;

        return {
          ...project,
          tasksCount: project.tasks.count,
          membersCount: project.members.count,
          progress
        };
      }));

      setProjects(projectsWithProgress);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    fetchProjects(); // Refresh the projects list
  };

  const handleCreateTask = (projectId: string) => {
    // TODO: Implement task creation
    console.log('Creating task for project:', projectId);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Organization Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading projects...</Typography>
      ) : projects.length === 0 || projects.length === null ? (
        // TODO: Add a button to create a project here
        <EmptyState
          title="No Projects Yet"
          description="Get started by creating your first project to organize your work and collaborate with your team."
          icon={<AddIcon sx={{ fontSize: 48 }} />}
        />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectOverviewWidget
                project={project}
                onCreateTask={() => handleCreateTask(project.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </Box>
  );
};

export default OrganizationProjects;
