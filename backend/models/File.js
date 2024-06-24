const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  fileBuffer: Buffer, // Store file data as a buffer
  size: Number,
  date: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;