import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer'); // 'admin' or 'customer'
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      let body = {};

      if (userType === 'admin') {
        // Admin Login
        endpoint = 'http://localhost:5001/api/auth/admin/login';
        body = {
          email: formData.email,
          password: formData.password
        };
      } else {
        // Customer Login or Signup
        if (isSignup) {
          endpoint = 'http://localhost:5001/api/auth/customer/signup';
          body = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            organization: formData.organization
          };
        } else {
          endpoint = 'http://localhost:5001/api/auth/customer/login';
          body = {
            email: formData.email,
            password: formData.password
          };
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.fullName);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchUserType = (type) => {
    setUserType(type);
    setIsSignup(false);
    setError('');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      organization: ''
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="Living Trend"
              style={{ height: '140px', marginBottom: '1rem' }}
            />
            <p>Design your dream space with our innovative 3D visualization technology</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            {/* User Type Selector */}
            <div className="user-type-selector">
              <button
                className={`type-btn ${userType === 'customer' ? 'active' : ''}`}
                onClick={() => switchUserType('customer')}
              >
                👤 Customer
              </button>
              <button
                className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                onClick={() => switchUserType('admin')}
              >
                🔐 Admin
              </button>
            </div>

            <h2>
              {userType === 'admin' 
                ? 'Admin Login' 
                : (isSignup ? 'Create Account' : 'Welcome Back')}
            </h2>
            <p className="login-subtitle">
              {userType === 'admin'
                ? 'Sign in to admin dashboard'
                : (isSignup ? 'Sign up to get started' : 'Sign in to continue')}
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Full Name - Only for customer signup */}
              {userType === 'customer' && isSignup && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

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
                  minLength={8}
                />
              </div>

              {/* Organization - Only for customer signup */}
              {userType === 'customer' && isSignup && (
                <div className="form-group">
                  <label>Organization (Optional)</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="Your company or organization"
                  />
                </div>
              )}

              {!isSignup && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button 
                    type="button"
                    className="forgot-password"
                    onClick={() => alert('Password reset feature coming soon!')}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            {/* Toggle between login and signup - Only for customers */}
            {userType === 'customer' && (
              <div className="form-footer">
                <p>
                  {isSignup ? "Already have an account? " : "Don't have an account? "}
                  <button 
                    className="toggle-form"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                    }}
                  >
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
