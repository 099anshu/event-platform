const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['tech', 'cultural', 'sports', 'debate']
    },
    subCategory: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    teamMembers: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        role: String
    }],
    achievement: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
        min: 1
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Define subcategories for each category
winnerSchema.statics.categoryMap = {
    tech: ['hackathon', 'ideathon', 'research', 'coding', 'robotics'],
    cultural: ['dance', 'music', 'drama', 'art', 'photography', 'annual'],
    sports: ['tennis', 'basketball', 'cricket', 'football', 'volleyball', 'athletics'],
    debate: ['parliamentary', 'mun', 'group', 'individual']
};

module.exports = mongoose.model('Winner', winnerSchema); 