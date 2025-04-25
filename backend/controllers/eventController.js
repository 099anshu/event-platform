const Event = require('../models/Event');

// Get upcoming events (with optional limit)
exports.getUpcomingEvents = async (req, res) => {
    try {
        const { limit } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let query = Event.find({ date: { $gte: today } }).sort({ date: 1 });
        
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const events = await query;
        res.json(events);
    } catch (err) {
        console.error('Error fetching upcoming events:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching upcoming events',
            error: err.message 
        });
    }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching event',
            error: err.message 
        });
    }
};

// Create new event (admin only)
exports.createEvent = async (req, res) => {
    try {
        const { 
            name, 
            date, 
            time,
            description, 
            location,
            imageUrl,
            registrationDuration 
        } = req.body;

        const newEvent = await Event.create({
            name,
            date,
            time,
            description,
            location,
            imageUrl,
            registrationDuration,
            createdBy: req.user.id // From auth middleware
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating event',
            error: err.message 
        });
    }
};

// Get all events (admin only)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error('Error fetching all events:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching all events',
            error: err.message 
        });
    }
};

// Update event (admin only)
exports.updateEvent = async (req, res) => {
    try {
        const { 
            name, 
            date, 
            time,
            description, 
            location,
            imageUrl,
            registrationDuration 
        } = req.body;

        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            {
                name,
                date,
                time,
                description,
                location,
                imageUrl,
                registrationDuration,
                updatedBy: req.user.id,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating event',
            error: err.message 
        });
    }
};

// Delete event (admin only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        await Event.findByIdAndDelete(req.params.eventId);
        
        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: err.message
        });
    }
}; 