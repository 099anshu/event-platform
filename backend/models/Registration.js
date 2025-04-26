const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Reference to the event and user
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Registration status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  currentStep: {
    type: Number,
    min: 1,
    max: 7,
    default: 1
  },

  // Basic Information
  fullName: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  email: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  phone: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  dateOfBirth: {
    type: Date,
    required: function() { return this.status === 'submitted'; }
  },
  gender: String,

  // Academic/Professional Details
  institution: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  degree: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  graduationYear: {
    type: Number,
    required: function() { return this.status === 'submitted'; }
  },
  location: {
    city: {
      type: String,
      required: function() { return this.status === 'submitted'; }
    },
    state: {
      type: String,
      required: function() { return this.status === 'submitted'; }
    },
    country: {
      type: String,
      required: function() { return this.status === 'submitted'; }
    }
  },

  // Team Information
  participationType: {
    type: String,
    enum: ['solo', 'team'],
    required: function() { return this.status === 'submitted'; }
  },
  teamName: {
    type: String,
    required: function() { return this.status === 'submitted' && this.participationType === 'team'; }
  },
  teamMembers: [{
    name: String,
    email: String
  }],

  // Hackathon Details
  track: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  skills: {
    type: String,
    required: function() { return this.status === 'submitted'; }
  },
  projectIdea: String,
  portfolioLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },

  // Logistics
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: function() { return this.status === 'submitted'; }
  },
  requiresAccommodation: {
    type: Boolean,
    default: false
  },
  dietaryPreferences: String,

  // Legal & Consents
  codeOfConductConsent: {
    type: Boolean,
    required: function() { return this.status === 'submitted'; }
  },
  parentalConsent: Boolean,
  mediaReleaseConsent: {
    type: Boolean,
    required: function() { return this.status === 'submitted'; }
  },
  termsAndConditionsConsent: {
    type: Boolean,
    required: function() { return this.status === 'submitted'; }
  },

  // Optional Questions
  howDidYouHear: String,
  expectedLearning: String
}, {
  timestamps: true
});

// Add indexes for faster queries
registrationSchema.index({ event: 1, user: 1 }, { unique: true });
registrationSchema.index({ status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
