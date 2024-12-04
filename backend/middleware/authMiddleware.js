const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = req.header('x-auth-token') || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Match this to your JWT_SECRET
        req.user = decoded;  // Attach the decoded payload to req.user
        next();  // Continue to the next middleware/route handler
    } catch (error) {
        console.error('JWT Error:', error.message);  // Log error for debugging
        res.status(401).json({ message: 'Authorization denied: Invalid or expired token' });
    }
};

module.exports = verifyToken;
