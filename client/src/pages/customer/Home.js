import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar userRole="customer" />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to 3D Furniture Visualizer</h1>
          <p className="hero-subtitle">
            Transform your space with our innovative 3D furniture visualization technology. 
            Design your dream room before you buy.
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate('/login')}
          >
            🎨 Create New Design
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

      <Footer />
    </div>
  );
};

export default Home;
