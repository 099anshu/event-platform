const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const eventController = require('../controllers/eventController');

// 🔐 Middleware to check for admin
const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user && user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

// ➕ Add New Event
router.post('/add-event', authMiddleware, adminOnly, eventController.createEvent);

// 🏆 Add Winner to Event
router.post('/add-winner', authMiddleware, adminOnly, async (req, res) => {
  const { eventId, winnerName } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.winner = winnerName;
    await event.save();

    res.status(200).json({ message: 'Winner added successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error while adding winner' });
  }
});

// 📋 Get All Registrations
router.get('/registrations', authMiddleware, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find().populate('eventId').populate('studentId');

    const formatted = registrations.map((reg) => ({
      studentName: reg.studentId.name,
      studentEmail: reg.studentId.email,
      eventName: reg.eventId.name,
      eventDate: reg.eventId.date,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
});

router.put('/events/:eventId', authMiddleware, adminOnly, eventController.updateEvent);
router.delete('/events/:eventId', authMiddleware, adminOnly, eventController.deleteEvent);

module.exports = router;

