/// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const winnerRoutes = require('./routes/winnerRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001; // Using port 5001

// Connect to MongoDB
connectDB();

// CORS configuration - allow all origins for development
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Debug logging for static files
app.use('/uploads', (req, res, next) => {
    console.log('Static file requested:', req.path);
    next();
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test routes with better logging
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ 
    message: '🎉 Server is running',
    routes: {
      auth: '/api/auth/*',
      events: '/api/events/*',
      registrations: '/api/registrations/*',
      admin: '/api/admin/*',
      gallery: '/api/gallery/*'
    }
  });
});

// Test signup form route
app.get('/test-signup', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Test Signup Form</h2>
        <form id="signupForm">
          <div>
            <label>Name:</label>
            <input type="text" id="name" required>
          </div>
          <div>
            <label>Email:</label>
            <input type="email" id="email" required>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" id="password" required>
          </div>
          <div>
            <label>Role:</label>
            <select id="role">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div id="result"></div>

        <script>
          document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
              name: document.getElementById('name').value,
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
              role: document.getElementById('role').value
            };
            
            try {
              const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              
              const result = await response.json();
              document.getElementById('result').innerHTML = JSON.stringify(result, null, 2);
            } catch (error) {
              document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/ping', (req, res) => {
  console.log('Ping route accessed');
  res.json({ message: 'pong 🏓' });
});

// Test auth route
app.get('/api/auth/test', (req, res) => {
  console.log('Auth test route accessed');
  res.json({ message: 'Auth routes are working' });
});

// Mount API routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/winners', winnerRoutes);

// Global error handler (should be last)
app.use((err, req, res, next) => {
  console.error('❗Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is live at: http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  - GET    /api/events/upcoming');
  console.log('  - GET    /api/events/:eventId');
  console.log('  - POST   /api/auth/signup');
  console.log('  - POST   /api/auth/login');
  console.log('  - POST   /api/registrations');
  console.log('  - GET    /api/registrations/my');
  console.log('  - GET    /api/gallery/latest');
  console.log('Admin routes:');
  console.log('  - POST   /api/events');
  console.log('  - GET    /api/events/all');
  console.log('  - GET    /api/registrations/all');
  console.log('  - POST   /api/gallery/winners');
});
