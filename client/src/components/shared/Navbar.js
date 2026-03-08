import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
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
              <li>
                <Link 
                  to="/dashboard" 
                  className={isActive('/dashboard') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/room-setup" 
                  className={isActive('/room-setup') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Room Setup
                </Link>
              </li>
              <li>
                <Link 
                  to="/room-layout" 
                  className={isActive('/room-layout') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  2D Layout
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={isActive('/products') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              
              {userRole === 'admin' && (
                <>
                  <li>
                    <Link 
                      to="/admin/products" 
                      className={isActive('/admin/products') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Products
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/orders" 
                      className={isActive('/admin/orders') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Manage Orders
                    </Link>
                  </li>
                </>
              )}
              
              {userRole === 'customer' && (
                <li>
                  <Link 
                    to="/cart" 
                    className={isActive('/cart') ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="cart-icon">🛒</span> Cart
                  </Link>
                </li>
              )}
              
              <li className="nav-user">
                <button className="btn-user" onClick={handleLogout}>
                  👤 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={isActive('/login') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
