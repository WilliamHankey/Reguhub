import express from 'express';
import cors from 'cors';
import { Router } from 'express';
import filesRouter from '../../my-backend/routes/files';
import projectsRouter from '../../my-backend/routes/projects';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Handle file uploads and other routes
app.use('/api/files', filesRouter as Router);
app.use('/api/projects', projectsRouter as Router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 