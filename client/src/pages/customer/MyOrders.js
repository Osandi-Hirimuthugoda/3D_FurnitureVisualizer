import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getMyOrders } from '../../api/orders';
import './MyOrders.css';

const API_URL = 'http://localhost:5001/api';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const statusColors = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444'
};

const MyOrders = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`${API_URL}/orders/my-orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel: ' + err.message);
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div className="my-orders-page">
      <Navbar userRole={userRole} />

      <div className="my-orders-container">
        <div className="my-orders-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <div>
            <h1>My Orders</h1>
            <p className="subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
        </div>

        {loading ? (
          <div className="orders-loading">Loading your orders...</div>
        ) : error ? (
          <div className="orders-error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Browse our products and place your first order!</p>
            <button className="browse-btn" onClick={() => navigate('/products')}>Browse Products</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                {/* Header */}
                <div className="order-card-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                  <div className="order-meta">
                    <span className="order-number">#{order.orderNumber}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-header-right">
                    <span className="order-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    <span className="order-total-badge">Rs. {order.totalAmount.toLocaleString()}</span>
                    <span
                      className="order-status"
                      style={{ background: statusColors[order.status] + '20', color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}` }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="expand-icon">{expandedOrder === order._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Progress Tracker */}
                {order.status !== 'cancelled' && (
                  <div className="order-progress">
                    {STATUS_STEPS.map((step, idx) => (
                      <React.Fragment key={step}>
                        <div className={`progress-step ${idx <= getStepIndex(order.status) ? 'active' : ''}`}>
                          <div className="progress-dot"></div>
                          <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div className={`progress-line ${idx < getStepIndex(order.status) ? 'active' : ''}`}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-image">
                            {item.image && (item.image.startsWith('data:') || item.image.startsWith('http')) ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <span>{item.image || '🪑'}</span>
                            )}
                          </div>
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-details-info">
                        <span className="shipping-addr">📍 {order.shippingAddress}</span>
                        {order.customerPhone && <span className="order-phone">📞 {order.customerPhone}</span>}
                      </div>
                      <div className="order-footer-right">
                        <div className="order-totals">
                          <span className="order-total">Total: Rs. {order.totalAmount.toLocaleString()}</span>
                          <span className={`payment-status payment-${order.paymentStatus}`}>
                            💳 {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                          </span>
                        </div>
                        {['pending', 'processing'].includes(order.status) && (
                          <button
                            className="cancel-order-btn"
                            onClick={() => handleCancel(order._id)}
                            disabled={cancelling[order._id]}
                          >
                            {cancelling[order._id] ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
