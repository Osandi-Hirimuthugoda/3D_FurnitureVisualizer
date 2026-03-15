const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, cartController.getCart);
router.post('/', protect, cartController.addToCart);
router.put('/:productId', protect, cartController.updateQuantity);
router.delete('/clear', protect, cartController.clearCart);
router.delete('/:productId', protect, cartController.removeFromCart);

module.exports = router;
