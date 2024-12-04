const express = require('express');
const Song = require('../models/song'); // Import Song model
const router = express.Router();
// Example route to generate a mood-based playlist
router.get('/generate', async (req, res) => {
  const { mood } = req.query; // Get the mood from query params
  try {
    // Find songs based on the mood
    const songs = await Song.find({ mood });

    if (songs.length > 0) {
      res.status(200).json(songs); // Return the list of songs
    } else {
      res.status(404).json({ message: 'No songs found for the selected mood' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error generating mood playlist', error: err });
  }
});
module.exports = router;
