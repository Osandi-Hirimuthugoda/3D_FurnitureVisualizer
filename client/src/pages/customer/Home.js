import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'http://localhost:5001/api';

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [discountedProducts, setDiscountedProducts] = useState([]);

  useEffect(() => {
    // Fetch products with discounts from backend
    const fetchDiscountedProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?sortBy=discount`);
        const data = await res.json();
        if (data.success) {
          // Only show products with discount > 0, max 4
          const deals = data.products.filter(p => p.discount > 0).slice(0, 4);
          setDiscountedProducts(deals);
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
      }
    };
    fetchDiscountedProducts();
  }, []);

  const handleGetStarted = () => {
    // Always go to login page for Get Started
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    // Always go to login page
    navigate('/login');
  };

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="Living Trend"
              style={{ height: '50px', filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div className="nav-actions">
            {isAuthenticated ? (
              <button 
                className="btn-dashboard"
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                className="btn-login"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Living Trend</h1>
          <p className="hero-subtitle">
            Transform your space with our innovative 3D furniture visualization technology. 
            Design your dream room before you buy.
          </p>
          <button 
            className="cta-button"
            onClick={handleGetStarted}
          >
            🎨 Get Started
          </button>
        </div>
        <div className="hero-image">
          <div className="floating-card">🪑</div>
          <div className="floating-card">🛋️</div>
          <div className="floating-card">🪟</div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy to Use</h3>
            <p>Intuitive interface for seamless room design</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📐</div>
            <h3>Accurate Measurements</h3>
            <p>Precise dimensions for perfect furniture placement</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Choose colors, materials, and styles</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Save & Share</h3>
            <p>Save your designs and share with others</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">📏</div>
            <h3>Measure Your Room</h3>
            <p>Enter your room dimensions and choose the shape</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">🪑</div>
            <h3>Add Furniture</h3>
            <p>Browse and place furniture in your virtual room</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">🎨</div>
            <h3>Customize</h3>
            <p>Adjust colors, materials, and arrangements</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">✨</div>
            <h3>Visualize in 3D</h3>
            <p>See your room come to life in stunning 3D</p>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      {discountedProducts.length > 0 && (
        <section className="deals-section">
          <div className="deals-header">
            <div className="deals-badge">🔥 HOT DEALS</div>
            <h2>Special Discounts</h2>
            <p className="section-subtitle">Limited time offers on our best furniture</p>
          </div>
          <div className="deals-grid">
            {discountedProducts.map(product => (
              <div key={product._id} className="deal-card">
                <div className="deal-discount-badge">-{product.discount}%</div>
                <div className="deal-image">
                  {product.image && (product.image.startsWith('data:') || product.image.startsWith('http')) ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span className="deal-emoji">{product.image || '🪑'}</span>
                  )}
                </div>
                <div className="deal-info">
                  <h3>{product.name}</h3>
                  <p className="deal-category">{product.category}</p>
                  <div className="deal-pricing">
                    <span className="deal-original">Rs. {product.price.toLocaleString()}</span>
                    <span className="deal-discounted">
                      Rs. {Math.round(product.price - (product.price * product.discount / 100)).toLocaleString()}
                    </span>
                  </div>
                  <button className="deal-btn" onClick={handleGetStarted}>
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="deals-cta">
            <button className="view-all-deals-btn" onClick={handleGetStarted}>
              🛍️ View All Deals
            </button>
          </div>
        </section>
      )}

      <section className="gallery-section">
        <h2>Design Gallery</h2>
        <p className="section-subtitle">Get inspired by these beautiful room designs</p>
        <div className="gallery-grid">
          <div className="gallery-item">
            <div className="gallery-placeholder">🛋️</div>
            <h4>Modern Living Room</h4>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder">🛏️</div>
            <h4>Cozy Bedroom</h4>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder">🍽️</div>
            <h4>Elegant Dining</h4>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder">💼</div>
            <h4>Home Office</h4>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "This tool helped me visualize my living room perfectly before buying furniture. Saved me from making costly mistakes!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <h4>Sarah Johnson</h4>
                <p>Interior Designer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Amazing 3D visualization! I could see exactly how my furniture would fit and look. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <h4>Michael Chen</h4>
                <p>Homeowner</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The best room planning tool I've used. Intuitive, accurate, and the 3D view is incredible!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div>
                <h4>Emma Williams</h4>
                <p>Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2>Choose Your Plan</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">
              <span className="currency">Rs.</span>
              <span className="amount">0</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ 3 Room Designs</li>
              <li>✓ Basic Furniture Library</li>
              <li>✓ 2D View</li>
              <li>✓ Save Designs</li>
            </ul>
            <button className="pricing-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="pricing-card featured">
            <div className="popular-badge">Most Popular</div>
            <h3>Pro</h3>
            <div className="price">
              <span className="currency">Rs.</span>
              <span className="amount">1,990</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Unlimited Designs</li>
              <li>✓ Premium Furniture Library</li>
              <li>✓ 3D Visualization</li>
              <li>✓ Export & Share</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="pricing-btn primary" onClick={handleGetStarted}>
              Start Free Trial
            </button>
          </div>
          <div className="pricing-card">
            <h3>Business</h3>
            <div className="price">
              <span className="currency">Rs.</span>
              <span className="amount">4,990</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Everything in Pro</li>
              <li>✓ Team Collaboration</li>
              <li>✓ Custom Branding</li>
              <li>✓ API Access</li>
              <li>✓ Dedicated Support</li>
            </ul>
            <button className="pricing-btn" onClick={handleGetStarted}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for design tips and updates</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2024 Living Trend. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
