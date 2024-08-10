const express = require('express');
const Worker = require('../models/Worker');

const router = express.Router();

// Get all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new worker
router.post('/', async (req, res) => {
  const worker = new Worker(req.body);

  try {
    const newWorker = await worker.save();
    res.status(201).json(newWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
