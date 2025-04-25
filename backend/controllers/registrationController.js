// controllers/registrationController.js
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for an event
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const studentId = req.user.id;

        // Check if already registered
        const existingRegistration = await Registration.findOne({ eventId, studentId });
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Create registration
        const registration = await Registration.create({
            eventId,
            studentId
        });

        // Add registration to event
        await Event.findByIdAndUpdate(eventId, {
            $push: { registrations: registration._id }
        });

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            registration
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to register for event',
            error: err.message
        });
    }
};

// Get user's registrations
exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ studentId: req.user.id })
            .populate('eventId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            registrations
        });
    } catch (err) {
        console.error('Error fetching registrations:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: err.message
        });
    }
};

// Get all registrations (admin only)
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('eventId')
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            registrations
        });
    } catch (err) {
        console.error('Error fetching all registrations:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: err.message
        });
    }
};
