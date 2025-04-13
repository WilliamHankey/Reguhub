const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../utils/supabaseClient');
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
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('organization-logos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('organization-logos')
      .getPublicUrl(fileName);

    // Save file metadata to Supabase
    const { data: file, error } = await supabase
      .from('files')
      .insert([{
        filename: req.file.originalname,
        url: publicUrl,
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

    // Extract filename from URL
    const fileName = file.url.split('/').pop();

    // Delete from Supabase Storage
    const { error: deleteStorageError } = await supabase.storage
      .from('organization-logos')
      .remove([fileName]);

    if (deleteStorageError) throw deleteStorageError;

    // Delete metadata from Supabase
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