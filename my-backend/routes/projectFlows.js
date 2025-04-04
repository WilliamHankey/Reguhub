const express = require('express');
const ProjectFlow = require('../models/ProjectFlow');

const router = express.Router();

// Get all project flows
router.get('/', async (req, res) => {
  try {
    const projectFlows = await ProjectFlow.find();
    res.json(projectFlows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new project flow
router.post('/', async (req, res) => {
  const projectFlow = new ProjectFlow(req.body);

  try {
    const newProjectFlow = await projectFlow.save();
    res.status(201).json(newProjectFlow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
