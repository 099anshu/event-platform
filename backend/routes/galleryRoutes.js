const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery'); // Adjust path if needed

// ✅ Route: Get latest gallery items
router.get('/latest', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ date: -1 }).limit(3); // Latest 3
    res.json(galleryItems);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
