import React from 'react';
import {
  Container, Box, Avatar, Typography, TextField, Button,
  Grid, IconButton
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

function CreateOrganization() {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'transparent' }}>
          <img src="https://placehold.co/60x60" alt="Company Logo" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create your organization?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          Please fill out your organization's details
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="businessRegNo"
                label="Business Reg No."
                name="businessRegNo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="companyName"
                label="Company Name"
                name="companyName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateOrganization;
