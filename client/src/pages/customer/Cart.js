import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { createOrder } from '../../api/orders';
import { getCart, updateQuantity as apiUpdateQty, removeFromCart as apiRemove, clearCart as apiClear } from '../../api/cart';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    getCart()
      .then(data => setCartItems(data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    const data = await apiUpdateQty(productId, newQty);
    setCartItems(data.items);
  };

  const removeItem = async (productId) => {
    const data = await apiRemove(productId);
    setCartItems(data.items);
  };

  const clearCart = async () => {
    if (!window.confirm('Clear your cart?')) return;
    const data = await apiClear();
    setCartItems(data.items);
  };

  const getItemPrice = (item) => item.price; // price already discounted at add time
  const calculateSubtotal = () => cartItems.reduce((t, i) => t + getItemPrice(i) * i.quantity, 0);
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const items = cartItems.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity
      }));
      await createOrder({ items, shippingAddress: customerInfo.address, customerPhone: customerInfo.phone, notes: '' });
      await apiClear();
      setCartItems([]);
      setShowCheckoutModal(false);
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      alert('Failed to place order: ' + (err.response?.data?.message || err.message));
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

        {loading ? (
          <div className="empty-cart"><p>Loading cart...</p></div>
        ) : cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <button className="clear-cart-btn" onClick={clearCart}>
                  🗑️ Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => {
                  const productId = item.product?._id || item.product;
                  return (
                  <div key={productId} className="cart-item">
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
                      <div className="item-pricing">
                        <span className="price">Rs. {item.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(productId, item.quantity - 1)}>−</button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(productId, item.quantity + 1)}>+</button>
                      </div>

                      <div className="item-total">
                        <span className="total-label">Total:</span>
                        <span className="total-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>

                      <button className="remove-btn" onClick={() => removeItem(productId)}>🗑️ Remove</button>
                    </div>
                  </div>
                  );
                })}
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

              <button className="checkout-btn" onClick={() => setShowCheckoutModal(true)}>
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
