const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'musicspa-super-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Multer storage configuration for song uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'songs/'); // Save to the existing songs directory
    },
    filename: function (req, file, cb) {
        // Create unique filename
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
            cb(null, true);
        } else {
            cb(new Error('Only MP3 files are allowed!'), false);
        }
    }
});

// GET all local songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().populate('uploadedBy', 'username');
        
        // Map the results to match what the frontend expects 
        // (the frontend currently expects `uploadedBy` as a string username and an `id` field)
        const formatSongs = songs.map(s => ({
            id: s._id,
            name: s.name,
            fileName: s.fileName,
            uploadedBy: s.uploadedBy ? s.uploadedBy.username : 'Unknown'
        }));

        res.json(formatSongs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error fetching songs" });
    }
});

// POST upload a new song
router.post('/upload', authenticateToken, upload.single('song'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded or invalid file type" });
    }

    const songName = req.body.name || req.file.originalname;
    const fileName = req.file.filename;
    const uploadedBy = req.user.userId;

    try {
        const newSong = await Song.create({
            name: songName,
            fileName: fileName,
            uploadedBy: uploadedBy
        });

        res.status(201).json({ 
            message: "Song uploaded successfully", 
            song: {
                id: newSong._id,
                name: songName,
                fileName: fileName
            }
        });
    } catch (err) {
         console.error(err);
         res.status(500).json({ message: "Error saving song metadata to database" });
    }
});

module.exports = router;
