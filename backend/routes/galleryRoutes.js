const express = require('express');
const router = express.Router();
const { 
    getLatestWinners,
    addWinner
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/latest', getLatestWinners);

// Admin routes
router.post('/winners', [authMiddleware, adminMiddleware], addWinner);

module.exports = router;
