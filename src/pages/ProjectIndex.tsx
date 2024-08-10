import React from 'react';
import { 
  Container, Grid, Paper, Accordion, AccordionSummary, 
  AccordionDetails, Button, Box, Typography 
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const ProjectIndex: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', minHeight: '100vh', padding: 2 }}>
      <Container maxWidth={false} sx={{ padding: 0 }}>
        <Grid container spacing={2}>
          {/* Accordion Sidebar */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Letter of good standing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Detailed content about the letter of good standing goes here.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Public liability</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Detailed content about public liability goes here.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Employee List</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Detailed content about the employee list goes here.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Company Policies</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <b>HSE Policy</b><br/>
                    A health and safety policy sets out your general approach to health and safety. It explains how you, as an employer, will manage health and safety in your business.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="contained">Back</Button>
                    <Button variant="contained" color="primary">Next</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>

          {/* Document Upload Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Document Upload
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Click or drag and drop your PDF to upload.
              </Typography>
              <Box
                sx={{
                  border: '2px dashed gray',
                  borderRadius: 2,
                  padding: 4,
                  textAlign: 'center',
                  backgroundColor: '#f4f4f4',
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px', // Ensures a fixed minimum height
                }}
              >
                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />}>
                  Upload File
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProjectIndex;
