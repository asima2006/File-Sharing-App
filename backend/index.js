const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  fileBuffer: Buffer,
  size: Number,
  date: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 * 1024 } });

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const { originalname, buffer, mimetype, size } = req.file;

    const file = new File({
      filename: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + '_' + originalname,
      contentType: mimetype,
      fileBuffer: buffer,
      size: size,
    });

    await file.save();

    // Return a URL for accessing the uploaded file
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: `${req.protocol}://${req.get('host')}/files/${file._id}`
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Endpoint to get file by ID
app.get('/files/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.fileBuffer);
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Error retrieving file', error: error.message });
  }
});

// Serve static files from the 'frontend/build' directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Handle all routes by sending back the main index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));