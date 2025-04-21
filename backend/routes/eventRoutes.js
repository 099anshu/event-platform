const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// Get all upcoming events (today and beyond)
router.get('/upcoming', async (req, res) => {
  const today = new Date(); // Get today's date
  today.setHours(0, 0, 0, 0); // Set the time to midnight (start of the day)

  try {
    const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 });
    res.json(events); // Return upcoming events as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Example of a protected route (you can use this for CRUD operations on events)
router.post('/create',  async (req, res) => {
  // Only authorized users can create events
  const { name, date, location, description } = req.body;

  try {
    const newEvent = new Event({ name, date, location, description });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Event creation failed', error: err.message });
  }
});


module.exports = router; // Export router to use in the main app
