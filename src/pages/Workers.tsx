import React from 'react';
import {
  Container, Box, Avatar, Typography, TextField, Button,
  Grid, Checkbox, FormControlLabel, Link
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

function AddTeam() {
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
          Want to add your team?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          Invite them to your team to start, manage and complete projects together
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email1"
                label="john@example.com"
                name="email1"
                defaultValue="john@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email2"
                label="susan@example.com"
                name="email2"
                defaultValue="susan@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email3"
                label="tom@example.com"
                name="email3"
                defaultValue="tom@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox icon={<ContentCopyIcon />} color="primary" />}
                label="Copy the link to add"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item>
              <Link href="#" variant="body2">
                Skip
              </Link>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default AddTeam;
