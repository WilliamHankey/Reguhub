const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const supabase = require('./config/supabase');
const { s3, BUCKET_NAME, PUBLIC_URL } = require('./config/r2');
const authMiddleware = require('./middleware/auth');

const projectsRouter = require('./routes/projects');
const filesRouter = require('./routes/files');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Auth routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// File upload route
app.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileKey = `${req.user.id}/${Date.now()}-${req.file.originalname}`;
    
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    const fileUrl = `${PUBLIC_URL}/${fileKey}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/files', filesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
