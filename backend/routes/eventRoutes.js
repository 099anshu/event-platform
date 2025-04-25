const express = require('express');
const router = express.Router();
const { 
    getUpcomingEvents, 
    getEventById, 
    createEvent,
    getAllEvents 
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/upcoming', getUpcomingEvents); // Can accept ?limit=3 query param
router.get('/:eventId', getEventById);

// Admin only routes
router.post('/', [authMiddleware, adminMiddleware], createEvent);
router.get('/all', [authMiddleware, adminMiddleware], getAllEvents);

module.exports = router;
