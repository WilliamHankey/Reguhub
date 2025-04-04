import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  Grid, Box, Checkbox, FormControlLabel, IconButton, MenuItem, Avatar
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

function CreateProjectModal() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Project
      </Button>

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
    </div>
  );
}

export default CreateProjectModal;
