/**
 * Authentication & Authorization Middleware
 * Path: backend/middleware/authMiddleware.js
 */
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.headers.authorization?.replace('Bearer ', '');

    if (!userId) {
      return res.status(401).json({ error: 'Access denied: No authentication token/ID provided' });
    }

    // In production with JWT: jwt.verify(token, process.env.JWT_SECRET)
    // For MERN session interoperability:
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session user' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication verification failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
