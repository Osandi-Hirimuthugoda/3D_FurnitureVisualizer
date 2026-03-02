import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar userRole="admin" />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>0</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/room-setup')}
          >
            🎨 Create Room Design
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
