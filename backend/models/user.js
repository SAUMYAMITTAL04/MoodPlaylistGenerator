const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Ensure username is unique
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Keep email unique if still used for communication purposes
  },
  password: { 
    type: String, 
    required: true 
  },
  playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
