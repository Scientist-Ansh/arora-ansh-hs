const mongoose = require('mongoose');

const Note = new mongoose.Schema({
  title: String,
  createdBy: String,
  status: String,
  data: String,
});

module.exports = mongoose.model('Note', Note);
