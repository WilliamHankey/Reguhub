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

// Add this after other routes
app.post('/api/invite-worker', async (req, res) => {
  try {
    const { email, full_name, organization_id } = req.body;
    if (!email || !organization_id) {
      return res.status(400).json({ error: 'Email and organization_id are required' });
    }
    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    // 1. Create the user in Supabase
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true
    });
    if (createError) throw createError;
    if (!authData.user) {
      throw new Error('Failed to create user');
    }
    // 2. Create the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: full_name || '',
        avatar_url: null,
        updated_at: new Date().toISOString(),
      });
    if (profileError) throw profileError;
    // 3. Add to worker_invitations table
    const { error: inviteError } = await supabase
      .from('worker_invitations')
      .insert({
        email: email,
        status: 'pending',
        organization_id: organization_id,
      });
    if (inviteError) throw inviteError;
    res.json({ success: true });
  } catch (error) {
    console.error('Invite worker error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
