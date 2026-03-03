import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <li><Link to="/admin/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link></li>
            </>
          )}
          {userRole === 'customer' && (
            <>
              <li><Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</Link></li>
              <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <span className="cart-icon">🛒</span> Cart
              </Link></li>
            </>
          )}
          <li className="nav-user">
            <button className="btn-user">
              {userRole === 'admin' ? '👤 Admin' : '👤 Account'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
