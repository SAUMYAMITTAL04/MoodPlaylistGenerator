
const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [String], // Array of song names
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User reference
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;
