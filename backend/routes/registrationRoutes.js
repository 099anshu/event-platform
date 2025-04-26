const express = require('express');
const router = express.Router();
const { 
    createRegistration,
    getRegistrationsByEvent,
    getRegistrationsByUser,
    getRegistrationById,
    updateRegistration,
    deleteRegistration,
    submitRegistration
} = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Student routes
router.post('/submit', submitRegistration);
router.get('/my-registrations', getRegistrationsByUser);
router.get('/details/:registrationId', getRegistrationById);

// Admin only routes
router.get('/event/:eventId/all', adminMiddleware, getRegistrationsByEvent);
router.put('/details/:registrationId', adminMiddleware, updateRegistration);
router.delete('/details/:registrationId', adminMiddleware, deleteRegistration);

// Legacy route for backward compatibility
router.post('/', createRegistration);

module.exports = router;
