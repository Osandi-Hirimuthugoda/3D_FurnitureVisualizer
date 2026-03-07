import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <span className="brand-icon">🪑</span>
            <span className="brand-text">3D Furniture Visualizer</span>
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
         
          {userRole === 'admin' && (
            <>
              <li><Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/admin/products" onClick={() => setIsMenuOpen(false)}>Manage Products</Link></li>
              <li><Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
            </>
          )}
          {userRole === 'customer' && (
            <>
              <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <span className="cart-icon">🛒</span> Cart
              </Link></li>
            </>
          )}
          <li className="nav-user">
            <button className="btn-user" onClick={handleLogout}>
              👤 Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
