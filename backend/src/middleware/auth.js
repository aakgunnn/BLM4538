const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'library_secret_key_2026';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'ERROR', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ status: 'ERROR', message: 'Invalid or expired token' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'ERROR', message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminOnly };
