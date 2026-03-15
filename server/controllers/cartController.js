const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ success: true, items: [] });
    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart  { productId, quantity }
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ error: 'Product is out of stock' });

    const price = product.discount > 0
      ? product.price - (product.price * product.discount / 100)
      : product.price;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find(i => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, name: product.name, price, image: product.image, quantity });
    }

    await cart.save();
    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/cart/:productId  { quantity }
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
