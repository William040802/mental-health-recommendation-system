const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined. Check your .env file.');
        return res.status(500).send('Server configuration error: Missing JWT secret');
    }

    console.log('JWT_SECRET during token verification:', process.env.JWT_SECRET);
    console.log('Full Authorization header received:', req.header('Authorization'));

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.error('Authorization header is missing');
        return res.status(401).send('Access Denied: No token provided');
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        console.error('Token is missing after extraction');
        return res.status(401).send('Access Denied: Token is missing');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid Token:', err.message);
            if (err.name === 'JsonWebTokenError') {
                return res.status(400).send('Invalid Token: Malformed or invalid signature');
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Invalid Token: Token has expired');
            } else {
                return res.status(403).send('Invalid Token: Verification failed');
            }
        }

        console.log('Authenticated user:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
