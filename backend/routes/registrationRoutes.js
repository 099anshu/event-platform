const express = require('express');
const router = express.Router();
const { 
    registerForEvent,
    getMyRegistrations,
    getAllRegistrations
} = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Student routes (protected)
router.post('/', authMiddleware, registerForEvent);
router.get('/my', authMiddleware, getMyRegistrations);

// Admin routes
router.get('/all', [authMiddleware, adminMiddleware], getAllRegistrations);

module.exports = router;
