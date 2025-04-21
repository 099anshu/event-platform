const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ Add this

dotenv.config(); // ✅ Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes); // ✅ Mount auth routes

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
