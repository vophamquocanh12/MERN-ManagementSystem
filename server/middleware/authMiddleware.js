// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Token missing or malformed',
      });
    }

    const token = authHeader.split(' ')[1];

    // ✅ Use the correct env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const user = await User.findById(decoded._id).select('-password'); // ✅ match _id used in token
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during token verification',
    });
  }
};

export default verifyToken;

// ✅ Role-based access middleware
export const verifyRole = (requiredRoles) => {
  return (req, res, next) => {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have access to this resource",
      });
    }

    next();
  };
};

// ✅ Admin or HR
export const isAdminOrHR = (req, res, next) => {
  const allowed = ["admin", "hr"];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Access denied: Admins and HR only",
    });
  }

  next();
};
