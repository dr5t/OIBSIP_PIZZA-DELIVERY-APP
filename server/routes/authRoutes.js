const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
} = require('../controllers/authController');

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
