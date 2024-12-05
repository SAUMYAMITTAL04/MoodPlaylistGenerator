require('dotenv').config();  // Ensure environment variables are loaded
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const playlistRoutes = require('./routes/playlist');

// Import middleware
const verifyToken = require('./middleware/authMiddleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Debugging: log the environment variables to check if they are loaded correctly
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// MongoDB URI from .env file
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Mongo URI is missing or undefined!');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);  // Auth routes for signup/login
app.use('/api/mood', moodRoutes);  // Mood-based playlist routes
app.use('/api/playlist', playlistRoutes);  // Playlist routes

// Example protected route (for testing user profile access)
app.get('/api/profile', verifyToken, (req, res) => {
    res.json({ message: 'User profile', user: req.user });
});

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Catch-all route to serve index.html for any unknown requests (frontend routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Test route (you can expand this later)
app.get('/', (req, res) => {
    res.send('Hello from the Mood Playlist Generator backend!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
