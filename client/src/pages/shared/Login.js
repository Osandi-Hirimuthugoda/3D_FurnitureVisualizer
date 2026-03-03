import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Login පරීක්ෂා කිරීම - මෙතන දැන් ඕනෑම email/password එකකට logic එක ලියන්න පුළුවන්
        if (credentials.email && credentials.password) {
            localStorage.setItem('userToken', 'fake-jwt-token'); 
            navigate('/admin/dashboard'); 
        } else {
            setError('Please enter your email and password.');
        }
    };

    return (
        <div className="login-page">
            <Link to="/" className="back-home">← Back to Home</Link>
            
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-box">
                        <span>88</span> 
                    </div>
                </div>

                <h2>Designer Login</h2>
                <p className="app-description">
                    Help customers visualize furniture in their rooms with stunning 2D and 3D design tools.
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email or Username</label>
                        <input 
                            type="text" 
                            name="email"
                            placeholder="Enter your email" 
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Enter your password" 
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="toggle-password">👁️</span>
                        </div>
                        <div className="forgot-link">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">Login</button>
                </form>

                <p className="register-text">
                    Don't have an account? <Link to="/register" className="link-button">Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;