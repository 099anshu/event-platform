const express = require('express');
const router = express.Router();
const { 
    getUpcomingEvents, 
    getEventById, 
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents 
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/upcoming', getUpcomingEvents); // Can accept ?limit=3 query param

// Admin only routes
router.get('/all', [authMiddleware, adminMiddleware], getAllEvents);

// Route with parameter should come last
router.get('/:eventId', getEventById);
router.post('/', [authMiddleware, adminMiddleware], createEvent);
router.put('/:eventId', [authMiddleware, adminMiddleware], updateEvent);
router.delete('/:eventId', [authMiddleware, adminMiddleware], deleteEvent);

module.exports = router;
