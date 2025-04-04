import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Collapse,
    TextField,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Menu,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    CircularProgress,
    Alert,
    Grid,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    SelectChangeEvent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    ButtonBase,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ExpandLess,
    ExpandMore,
    Folder,
    Description,
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    CloudUpload as CloudUploadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { DocumentItem, DocumentType, UserRole } from '../types/document';
import { supabase } from '../utils/supabaseClient';
import Header from 'src/components/Header';

// Add interface for document creation
interface CreateDocumentData extends Partial<DocumentItem> {
    project_id: string;
}

const SafetyIndex: React.FC = () => {
    const { id: projectId } = useParams<{ id: string }>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [userRole, setUserRole] = useState<UserRole>('viewer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createType, setCreateType] = useState<DocumentType>('folder');
    const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
    const [newItemName, setNewItemName] = useState('');
    
    // Menu states
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<DocumentItem | null>(null);
    
    // File upload states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Add these state variables after the other state declarations
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');

    // Add state for the add menu
    const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);

    // Add new state for document upload
    const [formData, setFormData] = useState({
        generalCategory: '',
        year: '',
        period: '',
        area: '',
    });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // Add new state for accordion
    const [activeStep, setActiveStep] = React.useState(0);
    const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>(false);

    // Fetch initial data
    React.useEffect(() => {
        fetchDocuments();
        checkUserRole();
        fetchCurrentUser();
    }, [projectId]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('project_id', projectId)
                .order('order');

            if (error) throw error;

            // Convert flat data to tree structure
            const tree = buildDocumentTree(data || []);
            setDocuments(tree);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkUserRole = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Check user's role in the project
            const { data, error } = await supabase
                .from('project_members')
                .select('role')
                .eq('project_id', projectId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            setUserRole(data?.role || 'viewer');
        } catch (err: any) {
            console.error('Error checking user role:', err);
            setUserRole('viewer');
        }
    };

    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    const handleCreateItem = async () => {
        try {
            const newItem: CreateDocumentData = {
                name: newItemName,
                type: createType,
                status: createType === 'file' ? 'placeholder' : undefined,
                parent_id: selectedParentId,
                order: documents.length,
                project_id: projectId || '',
            };

            const { data, error } = await supabase
                .from('documents')
                .insert([newItem])
                .select()
                .single();

            if (error) throw error;

            // Update local state
            setDocuments(prev => {
                const updated = [...prev];
                if (selectedParentId) {
                    // Add to parent's children
                    const parent = findItemById(updated, selectedParentId);
                    if (parent) {
                        parent.children = [...(parent.children || []), data];
                    }
                } else {
                    // Add to root level
                    updated.push(data);
                }
                return updated;
            });

            setCreateDialogOpen(false);
            setNewItemName('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Add this function before handleFileUpload
    const getCurrentUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination || userRole !== 'admin') return;

        const { source, destination } = result;
        const sourceParentId = source.droppableId === 'root' ? null : source.droppableId;
        const destParentId = destination.droppableId === 'root' ? null : destination.droppableId;

        try {
            // Update item's parent and order in database
            const { error } = await supabase
                .from('documents')
                .update({
                    parent_id: destParentId,
                    order: destination.index,
                })
                .eq('id', result.draggableId);

            if (error) throw error;

            // Update local state
            setDocuments(prev => {
                const updated = [...prev];
                const [removed] = sourceParentId === null
                    ? updated.splice(source.index, 1)
                    : findItemById(updated, sourceParentId)?.children?.splice(source.index, 1) || [];

                if (destParentId === null) {
                    updated.splice(destination.index, 0, removed);
                } else {
                    const destParent = findItemById(updated, destParentId);
                    if (destParent) {
                        destParent.children = destParent.children || [];
                        destParent.children.splice(destination.index, 0, removed);
                    }
                }
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Helper functions
    const buildDocumentTree = (flatData: DocumentItem[]): DocumentItem[] => {
        const map = new Map<string, DocumentItem>();
        const tree: DocumentItem[] = [];

        flatData.forEach(item => {
            map.set(item.id, { ...item, children: [] });
        });

        flatData.forEach(item => {
            const node = map.get(item.id)!;
            if (item.parent_id) {
                const parent = map.get(item.parent_id);
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(node);
                }
            } else {
                tree.push(node);
            }
        });

        return tree;
    };

    const findItemById = (items: DocumentItem[], id: string): DocumentItem | null => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItemById(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const updateItemInTree = (items: DocumentItem[], id: string, updates: Partial<DocumentItem>): DocumentItem[] => {
        return items.map(item => {
            if (item.id === id) {
                return { ...item, ...updates };
            }
            if (item.children) {
                return {
                    ...item,
                    children: updateItemInTree(item.children, id, updates),
                };
            }
            return item;
        });
    };

    // Render functions
    const renderDocumentItem = (item: DocumentItem, isDragging = false) => {
        const isExpanded = expandedItems.includes(item.id);
        const hasChildren = item.children && item.children.length > 0;

        return (
            <React.Fragment key={item.id}>
                <ListItem
                    sx={{
                        pl: item.parent_id ? 4 : 2,
                        bgcolor: isDragging ? 'action.hover' : 'transparent',
                    }}
                >
                    <ListItemIcon onClick={() => {
                        if (item.type === 'folder') {
                            setExpandedItems(prev =>
                                prev.includes(item.id)
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                            );
                        }
                    }}>
                        {item.type === 'folder' ? (
                            isExpanded ? <ExpandLess /> : <ExpandMore />
                        ) : (
                            <Description />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {userRole === 'admin' && (
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={(e) => {
                                    setSelectedItem(item);
                                    setMenuAnchorEl(e.currentTarget);
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
                {hasChildren && item.children && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Droppable droppableId={item.id}>
                            {(provided: DroppableProvided) => (
                                <List
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    component="div"
                                    disablePadding
                                >
                                    {(item.children || []).map((child, index) => (
                                        <Draggable
                                            key={child.id}
                                            draggableId={child.id}
                                            index={index}
                                            isDragDisabled={userRole !== 'admin'}
                                        >
                                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {renderDocumentItem(child, snapshot.isDragging)}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    // Update the file upload button to handle undefined URL
    const renderUploadedFile = (item: DocumentItem) => (
        <Box>
            <Typography variant="body1" gutterBottom>
                File uploaded by {item.uploaded_by} on{' '}
                {new Date(item.uploaded_at || '').toLocaleDateString()}
            </Typography>
            {item.file_url && (
                <Button
                    variant="contained"
                    href={item.file_url}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Document
                </Button>
            )}
        </Box>
    );

    // Add these functions before the return statement
    const handleRename = async () => {
        if (!selectedItem || !newName.trim()) return;

        try {
            const { error } = await supabase
                .from('documents')
                .update({ name: newName.trim() })
                .eq('id', selectedItem.id);

            if (error) throw error;

            // Update local state
            setDocuments(prev => updateItemInTree(prev, selectedItem.id, { name: newName.trim() }));
            setRenameDialogOpen(false);
            setNewName('');
            setSelectedItem(null);
            setMenuAnchorEl(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', selectedItem.id);

            if (error) throw error;

            // Update local state
            setDocuments(prev => {
                const updated = [...prev];
                if (selectedItem.parent_id) {
                    const parent = findItemById(updated, selectedItem.parent_id);
                    if (parent && parent.children) {
                        parent.children = parent.children.filter(child => child.id !== selectedItem.id);
                    }
                } else {
                    return updated.filter(item => item.id !== selectedItem.id);
                }
                return updated;
            });
            setMenuAnchorEl(null);
            setSelectedItem(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Add this near the other menu components
    const AddMenu = () => (
        <Menu
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={() => setAddMenuAnchorEl(null)}
        >
            <MenuItem onClick={() => {
                setCreateType('folder');
                setAddMenuAnchorEl(null);
                setCreateDialogOpen(true);
            }}>
                <ListItemIcon>
                    <Folder fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Folder</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                setCreateType('file');
                setAddMenuAnchorEl(null);
                setCreateDialogOpen(true);
            }}>
                <ListItemIcon>
                    <Description fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add File Placeholder</ListItemText>
            </MenuItem>
        </Menu>
    );

    const handleInputChange = (field: keyof typeof formData) => (event: SelectChangeEvent) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Upload files to storage
            for (const file of uploadedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${projectId}/${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;
            }

            // Clear form after successful upload
            setFormData({
                generalCategory: '',
                year: '',
                period: '',
                area: '',
            });
            setUploadedFiles([]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAccordionChange = (folderId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedAccordion(isExpanded ? folderId : false);
        if (isExpanded) {
            setActiveStep(0); // Reset step when opening a new folder
        }
    };

    const handleFolderFinish = (folderId: string) => {
        // Find the next folder
        const currentFolderIndex = documents.findIndex(folder => folder.id === folderId);
        if (currentFolderIndex < documents.length - 1) {
            // Collapse current folder and expand next one
            setExpandedAccordion(documents[currentFolderIndex + 1].id);
            setActiveStep(0); // Reset step for the new folder
        } else {
            // If this was the last folder, just collapse it
            setExpandedAccordion(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F4F4F4' }}>
            <Container maxWidth={false} sx={{ mt: 2, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, backgroundColor: '11192C' }} >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setSidebarOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" component="h1">
                        Safety Index
                    </Typography>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <Grid container spacing={3} sx={{ flex: 1 }}>
                    {/* Left side - Document Structure */}
                    <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                        <Paper elevation={1} sx={{ 
                            p: 3, 
                            border: '1px solid #e0e0e0',
                            borderRadius: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Document Structure
                            </Typography>
                            <Box sx={{ 
                                mt: 2,
                                flex: 1,
                                overflow: 'auto'
                            }}>
                                {documents.map((folder) => (
                                    <Accordion 
                                        key={folder.id}
                                        expanded={expandedAccordion === folder.id}
                                        onChange={handleAccordionChange(folder.id)}
                                        sx={{ 
                                            '&:before': { display: 'none' },
                                            boxShadow: 'none',
                                            backgroundColor: 'transparent',
                                            mb: 1
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            sx={{ 
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                '&.Mui-expanded': {
                                                    minHeight: '48px'
                                                }
                                            }}
                                        >
                                            <Typography>{folder.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 0, mt: 2 }}>
                                            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                                                {(folder.children || []).map((file, index) => (
                                                    <Step key={file.id}>
                                                        <StepLabel>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Description sx={{ mr: 1, fontSize: 20 }} />
                                                                <Typography>{file.name}</Typography>
                                                            </Box>
                                                        </StepLabel>
                                                        <StepContent>
                                                            <Box sx={{ mb: 2 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {file.status === 'uploaded' 
                                                                        ? `Uploaded on ${new Date(file.uploaded_at || '').toLocaleDateString()}`
                                                                        : 'Click to upload a file'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                                                <Button
                                                                    disabled={index === 0}
                                                                    onClick={handleBack}
                                                                    sx={{ borderRadius: 0 }}
                                                                >
                                                                    Back
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={index === (folder.children?.length || 0) - 1 
                                                                        ? () => handleFolderFinish(folder.id) 
                                                                        : handleNext}
                                                                    sx={{ borderRadius: 0 }}
                                                                >
                                                                    {index === (folder.children?.length || 0) - 1 ? 'Finish' : 'Next'}
                                                                </Button>
                                                            </Box>
                                                        </StepContent>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right side - Document Upload */}
                    <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                        <Paper elevation={1} sx={{ 
                            p: 3, 
                            border: '1px solid #e0e0e0',
                            borderRadius: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Document Upload
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Click or drag and drop your pdf to upload in hskkhks djhkdljhkjd sdakjhasdkjs kjhdsadkjshdkj sdakjshdkjas
                            </Typography>
                            <Box
                                sx={{
                                    border: '2px dashed',
                                    borderColor: 'grey.300',
                                    borderRadius: 1,
                                    p: 3,
                                    textAlign: 'center',
                                    mb: 2,
                                    cursor: 'pointer',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                />
                                <Button 
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ borderRadius: 0 }}
                                >
                                    UPLOAD FILE
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Sidebar */}
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={() => {
                        setSidebarOpen(false);
                        // Reset any focused elements when closing
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }}
                    PaperProps={{ 
                        sx: { 
                            width: 320,
                            borderRadius: 0
                        },
                        tabIndex: -1 // Prevent the paper from being focusable
                    }}
                    ModalProps={{
                        keepMounted: true, // Better accessibility
                        disableEnforceFocus: true, // Prevents the focus trap issue
                    }}
                >
                    <Box sx={{ p: 0 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            p: 1,
                            borderRadius: 0
                        }}>
                            <Typography variant="h6">Document Structure</Typography>
                            <IconButton 
                                onClick={() => setSidebarOpen(false)}
                                sx={{ color: 'primary.contrastText' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="root">
                                {(provided: DroppableProvided) => (
                                    <List
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {documents.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                                isDragDisabled={userRole !== 'admin'}
                                            >
                                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {renderDocumentItem(item, snapshot.isDragging)}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </List>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Drawer>

                {/* Create Item Dialog */}
                <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                    <DialogTitle>
                        Create New {createType === 'folder' ? 'Folder' : 'File Placeholder'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            fullWidth
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateItem} variant="contained">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Item Menu */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={() => setMenuAnchorEl(null)}
                >
                    {selectedItem?.type === 'folder' && (
                        <MenuItem onClick={() => {
                            setCreateType('folder');
                            setMenuAnchorEl(null);
                            setCreateDialogOpen(true);
                        }}>
                            <ListItemIcon>
                                <Folder fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add Folder</ListItemText>
                        </MenuItem>
                    )}
                    {selectedItem?.type === 'folder' && (
                        <MenuItem onClick={() => {
                            setCreateType('file');
                            setMenuAnchorEl(null);
                            setCreateDialogOpen(true);
                        }}>
                            <ListItemIcon>
                                <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Add File Placeholder</ListItemText>
                        </MenuItem>
                    )}
                    <MenuItem onClick={() => {
                        setMenuAnchorEl(null);
                        setRenameDialogOpen(true);
                        setNewName(selectedItem?.name || '');
                    }}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Add the Rename Dialog */}
                <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
                    <DialogTitle>Rename Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Name"
                            fullWidth
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename} variant="contained">
                            Rename
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Menu */}
                <AddMenu />
            </Container>
        </Box>
    );
};

export default SafetyIndex; 