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
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="nav-brand-link">
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="Living Trend"
              style={{ height: '40px', filter: 'brightness(0) invert(1)' }}
            />
            <span className="nav-brand-name">LIVING TREND</span>
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
                  to="/appearance" 
                  className={isActive('/appearance') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Appearance
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className={isActive('/portfolio') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portfolio
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
              <li>
                <Link 
                  to="/settings" 
                  className={isActive('/settings') ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
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
                <>
                  <li>
                    <Link 
                      to="/cart" 
                      className={isActive('/cart') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="cart-icon">🛒</span> Cart
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/my-orders" 
                      className={isActive('/my-orders') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📦 My Orders
                    </Link>
                  </li>
                </>
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
