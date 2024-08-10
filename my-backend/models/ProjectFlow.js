const mongoose = require('mongoose');

const projectFlowSchema = new mongoose.Schema({
  name: String,
  folder: Number,
  files: String,
  status: String
});

const ProjectFlow = mongoose.model('ProjectFlow', projectFlowSchema);

module.exports = ProjectFlow;
