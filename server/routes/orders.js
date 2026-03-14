const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrder);

// Admin only routes
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.get('/stats/summary', protect, adminOnly, orderController.getOrderStats);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);
router.delete('/:id', protect, adminOnly, orderController.deleteOrder);

module.exports = router;
