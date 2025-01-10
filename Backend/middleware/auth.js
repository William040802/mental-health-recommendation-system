const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateToken = (req, res, next) => {
    // Ensure the JWT_SECRET is loaded
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined. Check your .env file.');
        return res.status(500).send('Server configuration error: Missing JWT secret');
    }
    console.log('JWT_SECRET during token verification:', process.env.JWT_SECRET); // Debugging log

    console.log('Full Authorization header:', req.header('Authorization'));


    // Check for Authorization header
    const authHeader = req.header('Authorization');
    console.log('Authorization header received:', authHeader); // Debugging log

    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).send('Access Denied: No token provided');
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token); // Debugging log
    console.log('Full Authorization header:', authHeader);


    if (!token) {
        console.error('Bearer token is missing');
        return res.status(401).send('Access Denied: Token is missing');
    }

    // Verify the token
    console.log("Attempting jwt verification")
    onsole.log("Token:", token)
    onsole.log("process.env.JWT_SECRET:", process.env.JWT_SECRET)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid Token:', err.message);
            if (err.name === 'JsonWebTokenError') {
                console.error('Token is malformed or signature is invalid.');
            } else if (err.name === 'TokenExpiredError') {
                console.error('Token has expired.');
            } else {
                console.error('JWT verification error:', err);
            }
            return res.status(403).send('Invalid Token');
        }

        // If token is valid
        console.log('Authenticated user:', user); // Debugging log
        req.user = user; // Attach user to request object
        next();
    });
};

module.exports = authenticateToken;
