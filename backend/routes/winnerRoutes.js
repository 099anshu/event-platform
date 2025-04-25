const express = require('express');
const router = express.Router();
const {
    getAllWinners,
    getWinnersByCategory,
    getWinnerById,
    createWinner,
    updateWinner,
    deleteWinner
} = require('../controllers/winnerController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getAllWinners);
router.get('/category/:category', getWinnersByCategory);
router.get('/:winnerId', getWinnerById);

// Admin only routes
router.post('/', [authMiddleware, adminMiddleware], createWinner);
router.put('/:winnerId', [authMiddleware, adminMiddleware], updateWinner);
router.delete('/:winnerId', [authMiddleware, adminMiddleware], deleteWinner);

module.exports = router; 