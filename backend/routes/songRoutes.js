const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const upload = require('../middleware/uploadMiddleware'); // Import the file upload middleware

// POST /api/songs/upload - Add a new song with file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    const { title, artist, mood } = req.body;

    // Validation check
    if (!title || !artist || !mood || !req.file) {
        return res.status(400).json({ message: 'All fields (title, artist, mood) and a file are required.' });
    }

    try {
        // Check if the song already exists in the database
        const existingSong = await Song.findOne({ title, artist });

        if (existingSong) {
            return res.status(409).json({
                message: 'This song already exists in the database!',
                song: existingSong  // Optionally send back the existing song details
            });
        }

        // Save the song details, including the uploaded file path
        const newSong = new Song({
            title,
            artist,
            mood,
            file: req.file.path // Save the relative path to the file
        });

        const savedSong = await newSong.save();
        res.status(201).json({
            message: 'Song uploaded and saved successfully!',
            song: savedSong
        });
    } catch (err) {
        console.error('Error saving song:', err);
        res.status(500).json({ message: 'Failed to save song.' });
    }
});


module.exports = router;
