const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../utils/supabaseClient');
const { s3, BUCKET_NAME, PUBLIC_URL } = require('../config/r2');
const authMiddleware = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload a file
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { project_id } = req.body;
    const fileKey = `${req.user.id}/${Date.now()}-${req.file.originalname}`;
    
    // Upload to Cloudflare R2
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    const fileUrl = `${PUBLIC_URL}/${fileKey}`;

    // Save file metadata to Supabase
    const { data: file, error } = await supabase
      .from('files')
      .insert([{
        filename: req.file.originalname,
        url: fileUrl,
        content_type: req.file.mimetype,
        size: req.file.size,
        project_id: project_id,
        uploaded_by: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(file);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get files for a project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', req.params.projectId);

    if (error) throw error;
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a file
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Get file info from Supabase
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Extract key from URL
    const fileKey = file.url.replace(`${PUBLIC_URL}/`, '');

    // Delete from R2
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: fileKey
    }).promise();

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 