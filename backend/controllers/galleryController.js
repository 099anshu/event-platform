const Event = require('../models/Event');

// Get latest winners
exports.getLatestWinners = async (req, res) => {
    try {
        const events = await Event.find({ 'winners.0': { $exists: true } })
            .populate('winners.student', 'name')
            .sort({ date: -1 })
            .limit(10);

        const winners = events.reduce((acc, event) => {
            const eventWinners = event.winners.map(winner => ({
                ...winner.toObject(),
                eventName: event.name,
                eventDate: event.date
            }));
            return [...acc, ...eventWinners];
        }, []);

        res.json({
            success: true,
            winners
        });
    } catch (err) {
        console.error('Error fetching winners:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch winners',
            error: err.message
        });
    }
};

// Add winner to event (admin only)
exports.addWinner = async (req, res) => {
    try {
        const { eventId, studentId, position, imageUrl } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if position is already taken
        const existingWinner = event.winners.find(w => w.position === position);
        if (existingWinner) {
            return res.status(400).json({
                success: false,
                message: `Position ${position} is already taken`
            });
        }

        event.winners.push({
            student: studentId,
            position,
            imageUrl
        });

        await event.save();

        res.json({
            success: true,
            message: 'Winner added successfully',
            winner: event.winners[event.winners.length - 1]
        });
    } catch (err) {
        console.error('Error adding winner:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add winner',
            error: err.message
        });
    }
}; 