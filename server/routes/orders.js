const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin only routes
router.get('/stats/summary', protect, adminOnly, orderController.getOrderStats);
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);
router.delete('/:id', protect, adminOnly, orderController.deleteOrder);

// Single order (must be last to avoid catching /my-orders and /stats/summary)
router.get('/:id', protect, orderController.getOrder);

module.exports = router;
