const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const authMiddleware = require('../middleware/auth');

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:workers(full_name, role),
        project_workers(
          worker:workers(id, full_name, role)
        ),
        files(*)
      `);

    if (error) throw error;
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:workers(full_name, role),
        project_workers(
          worker:workers(id, full_name, role)
        ),
        project_flows(*),
        files(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, manager_id } = req.body;
    
    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        { name, description, manager_id }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, status, manager_id } = req.body;
    
    const { data: project, error } = await supabase
      .from('projects')
      .update({ name, description, status, manager_id })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Assign workers to a project
router.post('/:id/workers', authMiddleware, async (req, res) => {
  try {
    const { worker_ids } = req.body;
    const project_id = req.params.id;

    const workers = worker_ids.map(worker_id => ({
      project_id,
      worker_id
    }));

    const { data, error } = await supabase
      .from('project_workers')
      .insert(workers)
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error assigning workers:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
