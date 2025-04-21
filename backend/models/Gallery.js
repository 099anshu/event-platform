// backend/models/Gallery.js
const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', GallerySchema);
