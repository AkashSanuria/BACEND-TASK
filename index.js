const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/multer-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for your data
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  imagePath: String,
});

const Item = mongoose.model('Item', itemSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define the POST endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file.path;

    const newItem = new Item({
      title,
      description,
      imagePath,
    });

    await newItem.save();

    res.status(201).json({ message: 'Item uploaded successfully', item: newItem });
  } catch (error) {
    console.error('Error uploading item:', error);
    res.status(500).json({ message: 'Failed to upload item' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});