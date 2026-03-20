require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // 1. Import mongoose

const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve uploaded songs from /songs directory
app.use('/songs', express.static(path.join(__dirname, '../songs')));

// --- 2. MongoDB Connection Setup ---
// Replace the URI below if you are using MongoDB Atlas, 
// or ensure your local MongoDB instance is running.
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        
        // 3. Start the server ONLY after the database connects
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
// -----------------------------------

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

// Catch-all route to serve the AngularJS SPA for any non-API requests
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.url.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
        res.status(404).json({ message: "API route not found" });
    }
});

// Note: I removed the original app.listen() from the bottom 
// since it is now inside the mongoose.connect().then() block above.