const Winner = require('../models/Winner');
const Event = require('../models/Event');

// Get all winners
exports.getAllWinners = async (req, res) => {
    try {
        const winners = await Winner.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            winners
        });
    } catch (err) {
        console.error('Error fetching winners:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching winners',
            error: err.message
        });
    }
};

// Get winners by category
exports.getWinnersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const winners = await Winner.find({ category })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            winners
        });
    } catch (err) {
        console.error('Error fetching winners by category:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching winners',
            error: err.message
        });
    }
};

// Get winner by ID
exports.getWinnerById = async (req, res) => {
    try {
        const winner = await Winner.findById(req.params.winnerId)
            .populate('createdBy', 'name');

        if (!winner) {
            return res.status(404).json({
                success: false,
                message: 'Winner not found'
            });
        }

        res.json({
            success: true,
            winner
        });
    } catch (err) {
        console.error('Error fetching winner:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching winner',
            error: err.message
        });
    }
};

// Create new winner
exports.createWinner = async (req, res) => {
    try {
        const {
            category,
            subCategory,
            title,
            teamName,
            teamMembers,
            achievement,
            position,
            imageUrl
        } = req.body;

        // Validate category and subcategory
        if (!Winner.schema.statics.categoryMap[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        if (!Winner.schema.statics.categoryMap[category].includes(subCategory)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subcategory for the selected category'
            });
        }

        const winner = await Winner.create({
            category,
            subCategory,
            title,
            teamName,
            teamMembers,
            achievement,
            position,
            imageUrl,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Winner added successfully',
            winner
        });
    } catch (err) {
        console.error('Error creating winner:', err);
        res.status(500).json({
            success: false,
            message: 'Error creating winner',
            error: err.message
        });
    }
};

// Update winner
exports.updateWinner = async (req, res) => {
    try {
        const {
            category,
            subCategory,
            title,
            teamName,
            teamMembers,
            achievement,
            position,
            imageUrl
        } = req.body;

        // Validate category and subcategory if they're being updated
        if (category && !Winner.schema.statics.categoryMap[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        if (category && subCategory && !Winner.schema.statics.categoryMap[category].includes(subCategory)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subcategory for the selected category'
            });
        }

        const winner = await Winner.findById(req.params.winnerId);
        if (!winner) {
            return res.status(404).json({
                success: false,
                message: 'Winner not found'
            });
        }

        const updatedWinner = await Winner.findByIdAndUpdate(
            req.params.winnerId,
            {
                category: category || winner.category,
                subCategory: subCategory || winner.subCategory,
                title,
                teamName,
                teamMembers,
                achievement,
                position,
                imageUrl,
                updatedBy: req.user.id,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Winner updated successfully',
            winner: updatedWinner
        });
    } catch (err) {
        console.error('Error updating winner:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating winner',
            error: err.message
        });
    }
};

// Delete winner
exports.deleteWinner = async (req, res) => {
    try {
        const winner = await Winner.findById(req.params.winnerId);
        if (!winner) {
            return res.status(404).json({
                success: false,
                message: 'Winner not found'
            });
        }

        await Winner.findByIdAndDelete(req.params.winnerId);

        res.json({
            success: true,
            message: 'Winner deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting winner:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting winner',
            error: err.message
        });
    }
}; 