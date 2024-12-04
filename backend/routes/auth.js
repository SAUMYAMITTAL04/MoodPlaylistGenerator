const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs for hashing
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create a new user
        const newUser = new User({ username, email, password });

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await newUser.save();

        console.log('New User Created:', newUser); // Debugging log
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during Signup:', error.message);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Username does not exist' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, // Use the secret key from .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        console.log('Login Successful:', { username: user.username }); // Debugging log
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            username: user.username, 
            email: user.email 
        });
    } catch (error) {
        console.error('Error during Login:', error.message);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;
