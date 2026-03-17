import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { submitReview } from '../../api/reviews';
import './Dashboard.css';

const API_URL = 'http://localhost:5001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    myOrders: 0,
    myDesigns: 0
  });

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle'); // idle | submitting | done | error
  const [reviewError, setReviewError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewStatus('submitting');
    setReviewError('');
    try {
      await submitReview({ rating: reviewRating, comment: reviewComment });
      setReviewStatus('done');
      setReviewComment('');
      setReviewRating(5);
      setTimeout(() => setReviewStatus('idle'), 3000);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Unknown error';
      setReviewError(msg);
      setReviewStatus('error');
      setTimeout(() => setReviewStatus('idle'), 4000);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (userRole === 'admin') {
      fetchAdminStats();
    } else {
      fetchCustomerStats();
    }
  }, [userRole, token]);

  const fetchAdminStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/orders/stats/summary`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      setStats(s => ({
        ...s,
        totalProducts: productsData.count || 0,
        totalOrders: ordersData.stats?.total || 0,
        pendingOrders: ordersData.stats?.pending || 0,
        revenue: ordersData.stats?.revenue || 0
      }));
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const fetchCustomerStats = async () => {
    try {
      const [ordersRes, designsRes] = await Promise.all([
        fetch(`${API_URL}/orders/my-orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/designs/my-designs`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const ordersData = await ordersRes.json();
      const designsData = await designsRes.json();
      setStats(s => ({
        ...s,
        myOrders: ordersData.count || 0,
        myDesigns: designsData.designs?.length || 0
      }));
    } catch (err) {
      console.error('Failed to load customer stats:', err);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar userRole={userRole} />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome{userName ? `, ${userName}` : ''} 👋</h1>
          <p className="user-info">Logged in as: {userEmail} ({userRole})</p>
        </div>

        <div className="dashboard-content">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-cards">
              {userRole !== 'admin' && (
                <div className="action-card" onClick={() => navigate('/room-setup')}>
                  <div className="card-icon">🎨</div>
                  <h3>Create New Design</h3>
                  <p>Start designing your room in 3D</p>
                </div>
              )}

              <div className="action-card" onClick={() => navigate('/products')}>
                <div className="card-icon">🪑</div>
                <h3>Browse Products</h3>
                <p>Explore our furniture collection</p>
              </div>

              {userRole === 'admin' && (
                <>
                  <div className="action-card" onClick={() => navigate('/admin/products')}>
                    <div className="card-icon">📦</div>
                    <h3>Manage Products</h3>
                    <p>Add, edit, or remove products</p>
                  </div>

                  <div className="action-card" onClick={() => navigate('/admin/orders')}>
                    <div className="card-icon">📋</div>
                    <h3>Manage Orders</h3>
                    <p>View and process orders</p>
                  </div>
                </>
              )}

              {userRole === 'customer' && (
                <>
                  <div className="action-card" onClick={() => navigate('/cart')}>
                    <div className="card-icon">🛒</div>
                    <h3>My Cart</h3>
                    <p>View your shopping cart</p>
                  </div>
                  <div className="action-card" onClick={() => navigate('/my-orders')}>
                    <div className="card-icon">📦</div>
                    <h3>My Orders</h3>
                    <p>Track your orders</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dashboard-stats">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-info">
                  <h3>{userRole === 'customer' ? stats.myDesigns : 0}</h3>
                  <p>Designs Created</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-info">
                  <h3>{userRole === 'customer' ? stats.myDesigns : 0}</h3>
                  <p>Saved Projects</p>
                </div>
              </div>

              {userRole === 'customer' && (
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.myOrders}</h3>
                    <p>My Orders</p>
                  </div>
                </div>
              )}

              {userRole === 'admin' && (
                <>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>{stats.totalProducts}</h3>
                      <p>Total Products</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <h3>{stats.totalOrders}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <h3>{stats.pendingOrders}</h3>
                      <p>Pending Orders</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>Rs. {stats.revenue.toLocaleString()}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {userRole === 'customer' && (
        <div className="review-section-wrapper">
          <div className="review-form-card">
            <h3>⭐ Leave a Review</h3>
            <p>Share your experience with Living Trend</p>
            {reviewStatus === 'done' && (
              <div className="review-success">✅ Thank you for your review! It will appear on the home page.</div>
            )}
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-rating">
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= reviewRating ? 'active' : ''}`}
                    onClick={() => setReviewRating(star)}
                  >★</span>
                ))}
              </div>
              <textarea
                className="review-textarea"
                placeholder="Write your review here..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={4}
                required
              />
              <button
                type="submit"
                className="review-submit-btn"
                disabled={reviewStatus === 'submitting' || !reviewComment.trim()}
              >
                {reviewStatus === 'submitting' ? 'Submitting...' : reviewStatus === 'error' ? 'Failed, try again' : 'Submit Review'}
              </button>
              {reviewStatus === 'error' && reviewError && (
                <div className="review-error">❌ {reviewError}</div>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
