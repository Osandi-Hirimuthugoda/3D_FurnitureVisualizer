import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication (replace with real API call)
    if (formData.email && formData.password) {
      // Store user info in localStorage
      const userRole = formData.email.includes('admin') ? 'admin' : 'customer';
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard for both admin and customer
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <h1>🪑 3D Furniture Visualizer</h1>
            <p>Design your dream space with our innovative 3D visualization technology</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="login-subtitle">
              {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isLogin && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="btn-submit">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  className="toggle-form"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
