import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <footer className={`footer ${isAuthenticated ? 'with-sidebar' : ''}`}>
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>🪑 3D Furniture Visualizer</h3>
          <p>Transform your space with our innovative 3D furniture visualization technology. Design your dream room with ease and confidence.</p>
          <div className="footer-contact">
            <p>📧 info@furniturevisualizer.com</p>
            <p>📞 +94 11 234 5678</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/room-setup">Room Setup</Link></li>
                <li><Link to="/products">Products</Link></li>
                {userRole === 'customer' && <li><Link to="/cart">My Cart</Link></li>}
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/products">Products</Link></li>
              </>
            )}
          </ul>
        </div>
        
        {/* Customer Service */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms</a></li>
          </ul>
        </div>

        {/* Connect & Newsletter */}
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span className="social-icon">📘</span>
              <span className="social-name">Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span className="social-icon">📷</span>
              <span className="social-name">Instagram</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <span className="social-icon">🐦</span>
              <span className="social-name">Twitter</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <span className="social-icon">💼</span>
              <span className="social-name">LinkedIn</span>
            </a>
          </div>
          
          <div className="newsletter">
            <h4>Newsletter</h4>
            <p>Get updates and offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2026 3D Furniture Visualizer. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <span>•</span>
            <a href="#terms">Terms</a>
            <span>•</span>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
