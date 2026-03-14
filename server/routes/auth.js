const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Admin routes
router.post('/admin/login', authController.adminLogin);

// Customer routes
router.post('/customer/signup', authController.customerSignup);
router.post('/customer/login', authController.customerLogin);

// Protected routes
router.get('/me', protect, authController.getCurrentUser);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
