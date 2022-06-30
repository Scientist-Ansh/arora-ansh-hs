const mongoose = require('mongoose');

const Note = new mongoose.Schema({
  createdBy: String,
  status: String,
  data: String,
});

module.exports = mongoose.model('Note', Note);
