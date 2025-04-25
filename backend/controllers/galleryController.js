const Winner = require('../models/Winner');

// Get gallery items with filtering
exports.getGallery = async (req, res) => {
    try {
        const { event, year } = req.query;
        let query = {};

        // Add event filter if provided
        if (event && event !== 'all') {
            query.category = event;
        }

        // Add year filter if provided
        if (year && year !== 'all') {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
            query.createdAt = {
                $gte: startOfYear,
                $lte: endOfYear
            };
        }

        const winners = await Winner.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            winners
        });
    } catch (err) {
        console.error('Error fetching gallery:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery',
            error: err.message
        });
    }
};

// Get latest winners for homepage
exports.getLatestWinners = async (req, res) => {
    try {
        const winners = await Winner.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(6);

        res.json({
            success: true,
            winners
        });
    } catch (err) {
        console.error('Error fetching latest winners:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest winners',
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