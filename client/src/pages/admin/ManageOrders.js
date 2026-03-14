import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getAllOrders, updateOrderStatus, deleteOrder as deleteOrderAPI } from '../../api/orders';
import './ManageOrders.css';

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      const formattedOrders = data.orders.map(order => ({
        ...order,
        _id: order._id,
        orderDate: order.createdAt
      }));
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, orders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      alert('Order status updated successfully!');
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrderHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setLoading(true);
        await deleteOrderAPI(orderId);
        
        // Update local state
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        
        setShowModal(false);
        setSelectedOrder(null);
        alert('Order deleted successfully!');
      } catch (err) {
        setError(err.message);
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  return (
    <div className="manage-orders-page">
      <Navbar userRole="admin" />
      <div className="admin-layout">
        <main className="manage-orders-content">
          <div className="orders-header">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Back
            </button>
            <h1>Manage Orders</h1>
            <p className="subtitle">Track and manage customer orders</p>
          </div>

          {/* Order Statistics */}
          <div className="order-stats">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{orderStats.total}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{orderStats.pending}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚙️</div>
              <div className="stat-info">
                <h3>{orderStats.processing}</h3>
                <p>Processing</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-info">
                <h3>{orderStats.shipped}</h3>
                <p>Shipped</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{orderStats.delivered}</h3>
                <p>Delivered</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="orders-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-btn ${statusFilter === 'processing' ? 'active' : ''}`}
                onClick={() => setStatusFilter('processing')}
              >
                Processing
              </button>
              <button
                className={`filter-btn ${statusFilter === 'shipped' ? 'active' : ''}`}
                onClick={() => setStatusFilter('shipped')}
              >
                Shipped
              </button>
              <button
                className={`filter-btn ${statusFilter === 'delivered' ? 'active' : ''}`}
                onClick={() => setStatusFilter('delivered')}
              >
                Delivered
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-table-container">
            {filteredOrders.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td className="order-id">{order.orderNumber || order._id}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customerName}</strong>
                          <span className="customer-email">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>{order.items.length} item(s)</td>
                      <td className="order-total">Rs. {order.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            onClick={() => viewOrderDetails(order)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            disabled={loading}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No orders found</p>
                <p className="empty-hint">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="order-detail-section">
                <h3>Order Information</h3>
                <div className="detail-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedOrder.orderNumber || selectedOrder._id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Order Date:</span>
                  <span className="value">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Customer Information</h3>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedOrder.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedOrder.customerEmail}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedOrder.customerPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Shipping Address:</span>
                  <span className="value">{selectedOrder.shippingAddress}</span>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>Rs. {item.price.toLocaleString()}</td>
                        <td>Rs. {(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">Total Amount:</td>
                      <td className="total-amount">Rs. {selectedOrder.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="modal-actions">
                <select
                  className="status-update-select"
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  className="btn-delete"
                  onClick={() => deleteOrderHandler(selectedOrder._id)}
                  disabled={loading}
                >
                  🗑️ Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageOrders;
