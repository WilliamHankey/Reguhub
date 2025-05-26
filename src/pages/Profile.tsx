import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';
import Header from '../components/Header';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [assignedUploads, setAssignedUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    position: '',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchOrganizationData();
    fetchUploadHistory();
    fetchAssignedUploads();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch additional user profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUser({ ...user, ...data });
      setFormData({
        full_name: data?.full_name || '',
        phone: data?.phone || '',
        position: data?.position || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationData = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          organizations (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setOrganization(data?.organizations);
    } catch (err: any) {
      console.error('Error fetching organization:', err);
    }
  };

  const fetchUploadHistory = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          name,
          uploaded_at,
          status,
          file_url,
          projects (
            id,
            name
          )
        `)
        .eq('uploaded_by', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setUploadHistory(data || []);
    } catch (err: any) {
      console.error('Error fetching upload history:', err);
    }
  };

  const fetchAssignedUploads = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('document_assignments')
        .select(`
          id,
          status,
          assigned_at,
          documents (
            id,
            name,
            status,
            projects (
              id,
              name
            )
          )
        `)
        .eq('assigned_to', user.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      setAssignedUploads(data || []);
    } catch (err: any) {
      console.error('Error fetching assigned uploads:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          position: formData.position,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user data
      fetchUserData();
      setEditDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F4F4F4' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper elevation={1} sx={{ p: 3, borderRadius: 0 }}>
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={user?.avatar_url} 
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" component="h1">
                    {user?.full_name || user?.email}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.position || 'No position specified'}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{ mr: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/login');
                  }}
                >
                  Log Out
                </Button>
              </Box>
            </Grid>

            {/* Organization Info */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Organization</Typography>
                </Box>
                {organization ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {organization.logo_url && (
                      <Avatar 
                        src={organization.logo_url} 
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {organization.name.charAt(0)}
                      </Avatar>
                    )}
                    <Typography variant="body1">{organization.name}</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No organization associated
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Stats */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 0, textAlign: 'center' }}>
                    <DescriptionIcon sx={{ color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4">{uploadHistory.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Documents Uploaded</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 0, textAlign: 'center' }}>
                    <AssignmentIcon sx={{ color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4">{assignedUploads.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Assigned Uploads</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 0, textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4">
                      {assignedUploads.filter(a => a.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Completed Assignments</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Tabs */}
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                  <Tab label="Upload History" icon={<CloudUploadIcon />} iconPosition="start" {...a11yProps(0)} />
                  <Tab label="Assigned Uploads" icon={<AssignmentIcon />} iconPosition="start" {...a11yProps(1)} />
                </Tabs>
              </Box>

              {/* Upload History Tab */}
              <TabPanel value={tabValue} index={0}>
                {uploadHistory.length > 0 ? (
                  <List>
                    {uploadHistory.map((doc) => (
                      <React.Fragment key={doc.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <DescriptionIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={doc.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {doc.projects?.name || 'Unknown Project'}
                                </Typography>
                                {` — Uploaded on ${formatDate(doc.uploaded_at)}`}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={doc.status === 'uploaded' ? 'Uploaded' : 'Pending'} 
                              color={doc.status === 'uploaded' ? 'success' : 'warning'}
                              size="small"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      You haven't uploaded any documents yet
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              {/* Assigned Uploads Tab */}
              <TabPanel value={tabValue} index={1}>
                {assignedUploads.length > 0 ? (
                  <List>
                    {assignedUploads.map((assignment) => (
                      <React.Fragment key={assignment.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <AssignmentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={assignment.documents?.name || 'Unnamed Document'}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {assignment.documents?.projects?.name || 'Unknown Project'}
                                </Typography>
                                {` — Assigned on ${formatDate(assignment.assigned_at)}`}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={assignment.status === 'completed' ? 'Completed' : 'Pending'} 
                              color={assignment.status === 'completed' ? 'success' : 'warning'}
                              size="small"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      You don't have any assigned uploads
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              margin="dense"
              label="Full Name"
              name="full_name"
              fullWidth
              value={formData.full_name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Position"
              name="position"
              fullWidth
              value={formData.position}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 