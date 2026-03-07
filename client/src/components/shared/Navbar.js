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
    <nav className={`navbar ${userRole ? 'with-sidebar' : ''}`}>
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
          {userRole ? (
            <>
              <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/room-setup" onClick={() => setIsMenuOpen(false)}>Room Setup</Link></li>
              <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
              
              {userRole === 'admin' && (
                <>
                  <li><Link to="/admin/products" onClick={() => setIsMenuOpen(false)}>Manage Products</Link></li>
                  <li><Link to="/admin/orders" onClick={() => setIsMenuOpen(false)}>Manage Orders</Link></li>
                </>
              )}
              
              {userRole === 'customer' && (
                <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                  <span className="cart-icon">🛒</span> Cart
                </Link></li>
              )}
              
              <li className="nav-user">
                <button className="btn-user" onClick={handleLogout}>
                  👤 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
