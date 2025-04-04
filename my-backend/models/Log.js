const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  title: String,
  description: String
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
