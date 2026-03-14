import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getMyOrders } from '../../api/orders';
import './MyOrders.css';

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="my-orders-page">
      <Navbar userRole={userRole} />

      <div className="my-orders-container">
        <div className="my-orders-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>My Orders</h1>
          <p className="subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
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
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-number">#{order.orderNumber}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span
                    className="order-status"
                    style={{ background: statusColors[order.status] + '20', color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}` }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

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
                  <span className="shipping-addr">📍 {order.shippingAddress}</span>
                  <span className="order-total">Total: Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
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
