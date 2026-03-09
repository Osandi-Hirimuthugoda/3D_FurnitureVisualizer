import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  return (
    <div className="dashboard-page">
      <Navbar userRole={userRole} />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <p className="user-info">Logged in as: {userEmail}</p>
        </div>

        <div className="dashboard-content">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-cards">
              <div className="action-card" onClick={() => navigate('/room-setup')}>
                <div className="card-icon">🎨</div>
                <h3>Create New Design</h3>
                <p>Start designing your room in 3D</p>
              </div>

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
                <div className="action-card" onClick={() => navigate('/cart')}>
                  <div className="card-icon">🛒</div>
                  <h3>My Cart</h3>
                  <p>View your shopping cart</p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-stats">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Designs Created</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Saved Projects</p>
                </div>
              </div>

              {userRole === 'admin' && (
                <>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>0</h3>
                      <p>Total Products</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                      <h3>0</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
