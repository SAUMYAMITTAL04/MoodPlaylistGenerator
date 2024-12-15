const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];  // Extract the token after 'Bearer'

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied: No token provided' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log decoded token for debugging
        console.log('Decoded token:', decoded);  // Check what the token contains
        
        // Attach user information from the decoded token to the request object
        req.user = decoded;
        
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);  // Log error for debugging
        res.status(401).json({ message: 'Authorization denied: Invalid or expired token' });
    }
};

module.exports = verifyToken;
