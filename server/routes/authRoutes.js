import express from 'express';
import {
  login,
  register,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔐 Register route
router.post('/register', register);

// 🔑 Login route
router.post('/login', login);

// 🧠 Get current user profile (used in AuthContext)
router.get('/me', verifyToken, getCurrentUser);

// 🔁 Forgot password
router.post('/forgot-password', forgotPassword);

// 🔄 Reset password
router.post('/reset-password/:token', resetPassword);

// ✅ Token verification
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
