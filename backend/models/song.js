const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    mood: { type: String, required: true },  // Mood associated with the song
    file: { type: String, required: true }  // Path to the audio file
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
