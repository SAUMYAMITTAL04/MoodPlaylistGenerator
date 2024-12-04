const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Import bcrypt

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

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash if password is modified

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare the entered password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
