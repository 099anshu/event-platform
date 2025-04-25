const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  registrationDuration: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }],
  winners: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: {
      type: Number,
      required: true
    },
    imageUrl: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
