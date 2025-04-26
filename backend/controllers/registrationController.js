// controllers/registrationController.js
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { validateRegistration } = require('../utils/validation');

// Create a new registration
const createRegistration = async (req, res) => {
  try {
        const { eventId, additionalInfo, dietaryRestrictions, tshirtSize, emergencyContact } = req.body;
        const userId = req.user._id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if registration period is open
        const now = new Date();
        const registrationStart = new Date(event.registrationDuration.start);
        const registrationEnd = new Date(event.registrationDuration.end);

        if (now < registrationStart) {
            return res.status(400).json({ message: 'Registration period has not started yet' });
        }
        if (now > registrationEnd) {
            return res.status(400).json({ message: 'Registration period has ended' });
        }

        // Check if user is already registered
        const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
    }

        // Create registration
    const registration = new Registration({
            event: eventId,
            user: userId,
            additionalInfo,
            dietaryRestrictions,
            tshirtSize,
            emergencyContact,
            status: 'confirmed' // You can add different statuses like 'pending', 'confirmed', 'cancelled'
    });

    await registration.save();

        res.status(201).json({
            success: true,
            message: 'Successfully registered for the event',
            registration
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register for event' });
  }
};

// Get registrations for a specific event (admin only)
const getRegistrationsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ 
      event: eventId,
      status: 'submitted'
    })
      .populate('user', 'name email')
      .populate('event', 'name date');

    res.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
};

// Get user's registrations
const getRegistrationsByUser = async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      user: req.user._id
    })
    .populate({
      path: 'event',
      select: 'name date location imageUrl description'
    })
    .sort({ createdAt: -1 }); // Sort by newest first

    res.json(registrations);
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({ message: 'Failed to fetch your registrations' });
  }
};

// Get specific registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId)
      .populate('event', 'name date location imageUrl')
      .populate('user', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the user is authorized to view this registration
    if (!req.user.isAdmin && registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this registration' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ message: 'Failed to fetch registration details' });
  }
};

// Update registration (admin only)
const updateRegistration = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.registrationId,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ message: 'Failed to update registration' });
  }
};

// Delete registration (admin only)
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the user is authorized to delete this registration
    if (!req.user.isAdmin && registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this registration' });
    }

    await registration.remove();
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ message: 'Failed to delete registration' });
  }
};

// Save registration progress
const saveProgress = async (req, res) => {
  try {
    const { eventId, currentStep, ...formData } = req.body;
    const userId = req.user._id;

    // Find existing registration or create new one
    let registration = await Registration.findOne({ event: eventId, user: userId });
    
    if (registration) {
      // Update existing registration
      registration = await Registration.findOneAndUpdate(
        { event: eventId, user: userId },
        { 
          ...formData,
          currentStep,
          status: 'draft'
        },
        { new: true }
      );
    } else {
      // Create new registration
      registration = await Registration.create({
        event: eventId,
        user: userId,
        ...formData,
        currentStep,
        status: 'draft'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error saving registration progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving registration progress',
      error: error.message
    });
  }
};

// Submit registration
const submitRegistration = async (req, res) => {
  try {
    const { eventId, ...formData } = req.body;
    const userId = req.user._id;

    // Log the received data
    console.log('Received registration data:', {
      eventId,
      userId,
      formData
    });

    // Check if eventId is provided
    if (!eventId) {
      console.log('Error: Event ID is missing');
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Validate the registration data
    const validationError = validateRegistration(formData);
    if (validationError) {
      console.log('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: validationError
      });
    }

    // Check if event exists and is open for registration
    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Error: Event not found with ID:', eventId);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Log event details for debugging
    console.log('Event details:', {
      eventId: event._id,
      registrationStart: event.registrationDuration.start,
      registrationEnd: event.registrationDuration.end,
      currentTime: new Date()
    });

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({ 
      event: eventId, 
      user: userId,
      status: 'submitted'
    });

    if (existingRegistration) {
      console.log('Error: User already registered:', { userId, eventId });
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event has reached maximum participants
    const registrationCount = await Registration.countDocuments({
      event: eventId,
      status: 'submitted'
    });

    console.log('Registration count:', { eventId, registrationCount });

    if (registrationCount >= event.maxParticipants) {
      console.log('Error: Event full:', { eventId, registrationCount, maxParticipants: event.maxParticipants });
      return res.status(400).json({
        success: false,
        message: 'Event has reached maximum participants'
      });
    }

    // Prepare registration data
    const registrationData = {
      event: eventId,
      user: userId,
      status: 'submitted',
      currentStep: 7,
      // Basic Information
      fullName: formData.fullName?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      // Academic Details
      institution: formData.institution?.trim(),
      degree: formData.degree?.trim(),
      graduationYear: formData.graduationYear,
      location: {
        city: formData.location?.city?.trim(),
        state: formData.location?.state?.trim(),
        country: formData.location?.country?.trim()
      },
      // Team Information
      participationType: formData.participationType,
      teamName: formData.teamName?.trim(),
      teamMembers: formData.teamMembers?.map(member => ({
        name: member.name?.trim(),
        email: member.email?.trim()
      })),
      // Hackathon Details
      track: formData.track?.trim(),
      skills: formData.skills?.trim(),
      projectIdea: formData.projectIdea?.trim(),
      portfolioLinks: {
        github: formData.portfolioLinks?.github?.trim(),
        linkedin: formData.portfolioLinks?.linkedin?.trim(),
        portfolio: formData.portfolioLinks?.portfolio?.trim()
      },
      // Logistics
      tshirtSize: formData.tshirtSize,
      requiresAccommodation: formData.requiresAccommodation || false,
      dietaryPreferences: formData.dietaryPreferences?.trim(),
      // Legal & Consents
      codeOfConductConsent: formData.codeOfConductConsent || false,
      parentalConsent: formData.parentalConsent || false,
      mediaReleaseConsent: formData.mediaReleaseConsent || false,
      termsAndConditionsConsent: formData.termsAndConditionsConsent || false,
      // Optional Questions
      howDidYouHear: formData.howDidYouHear?.trim(),
      expectedLearning: formData.expectedLearning?.trim()
    };

    // Log the prepared registration data
    console.log('Prepared registration data:', registrationData);

    // Create and save the registration
    const registration = new Registration(registrationData);
    await registration.save();

    console.log('Registration saved successfully:', registration._id);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration',
      error: error.message
    });
  }
};

// Get registration by event ID for current user
const getRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOne({ event: eventId, user: userId });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration',
      error: error.message
    });
  }
};

module.exports = {
    createRegistration,
    getRegistrationsByEvent,
    getRegistrationsByUser,
    getRegistrationById,
    updateRegistration,
    deleteRegistration,
    saveProgress,
    submitRegistration,
    getRegistration
};