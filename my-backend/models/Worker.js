const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  avatar: String,
  name: String
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
