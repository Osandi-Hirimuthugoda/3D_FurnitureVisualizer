const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Admin routes
router.post('/admin/login', authController.adminLogin);

// Customer routes
router.post('/customer/signup', authController.customerSignup);
router.post('/customer/login', authController.customerLogin);

// Protected route
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
