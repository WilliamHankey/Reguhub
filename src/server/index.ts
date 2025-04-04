import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Handle file uploads
app.use('/api', uploadRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 