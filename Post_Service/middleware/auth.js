const axios = require('axios');

// Middleware to validate session via Auth-Service
const validateSession = async (req, res, next) => {
    try {
        const response = await axios.get('http://user-service:4003/auth/user', {
            headers: {
                Cookie: req.headers.cookie, // Forward session cookie
            },
            withCredentials: true 
        });
        req.user = response.data.user; // Attach user info to the request
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = validateSession;
