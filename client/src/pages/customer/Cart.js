import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { createOrder } from '../../api/orders';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      updateCart([]);
    }
  };

  const calculateItemTotal = (item) => {
    const price = item.discount > 0 
      ? item.price - (item.price * item.discount / 100)
      : item.price;
    return price * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    try {
      // Build items array with product IDs for backend
      const items = cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      await createOrder({
        items,
        shippingAddress: customerInfo.address,
        customerPhone: customerInfo.phone,
        notes: ''
      });

      // Clear cart
      updateCart([]);
      setShowCheckoutModal(false);
      alert('Order placed successfully! Check your orders in the dashboard.');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    }
  };

  return (
    <div className="cart-page">
      <Navbar userRole={userRole} />
      
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1>Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <button className="clear-cart-btn" onClick={clearCart}>
                  🗑️ Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-image">
                      {item.image ? (
                        item.image.startsWith('data:image') || item.image.startsWith('http') ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span className="emoji-image">{item.image}</span>
                        )
                      ) : (
                        <span className="emoji-image">🪑</span>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-dimensions">
                        {item.dimensions.length}m × {item.dimensions.width}m × {item.dimensions.height}m
                      </p>
                      
                      <div className="item-pricing">
                        {item.discount > 0 ? (
                          <>
                            <span className="original-price">Rs. {item.price.toLocaleString()}</span>
                            <span className="discounted-price">
                              Rs. {(item.price - (item.price * item.discount / 100)).toLocaleString()}
                            </span>
                            <span className="discount-badge">{item.discount}% OFF</span>
                          </>
                        ) : (
                          <span className="price">Rs. {item.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total">
                        <span className="total-label">Total:</span>
                        <span className="total-price">
                          Rs. {calculateItemTotal(item).toLocaleString()}
                        </span>
                      </div>

                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {calculateSubtotal().toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Tax (8%):</span>
                <span>Rs. {calculateTax().toLocaleString()}</span>
              </div>

              <div className="summary-row shipping">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs. {calculateTotal().toLocaleString()}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to get started!</p>
            <button className="browse-products-btn" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Checkout</h2>
              <button className="close-btn" onClick={() => setShowCheckoutModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handlePlaceOrder}>
                <div className="form-section">
                  <h3>Customer Information</h3>
                  
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Shipping Address *</label>
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="Enter your complete shipping address"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Order Summary</h3>
                  <div className="checkout-summary">
                    <div className="summary-row">
                      <span>Items ({cartItems.length}):</span>
                      <span>Rs. {calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>Rs. {calculateTax().toLocaleString()}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>Rs. {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowCheckoutModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-place-order">
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
