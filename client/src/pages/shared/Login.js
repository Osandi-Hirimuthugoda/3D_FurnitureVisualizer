import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
// මෙතන නම හරියටම තියෙන්න ඕනේ. screenshot එකේ විදිහට bg-home.png.png ද බලන්න.
import backgroundImage from '../../assets/bg-home.png.png'; 

const Login = () => {
    const [role, setRole] = useState('designer'); 
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        if (credentials.email && credentials.password) {
            localStorage.setItem('userToken', 'fake-jwt-token');
            localStorage.setItem('userRole', role); 
            navigate(role === 'admin' ? '/admin/dashboard' : '/designer/dashboard');
        } else {
            setError('Please enter your credentials to continue.');
        }
    };

    return (
        /* Inline style එකක් විදිහට background image එක දෙනවා */
        <div className="login-page" style={{ '--bg-img': `url(${backgroundImage})` }}>
            <Link to="/" className="back-home">← Back to Home</Link>
            
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-box"><span>88</span></div>
                </div>

                <h2>{role === 'admin' ? 'Admin Login' : 'Designer Login'}</h2>
                
                <div className="role-tabs">
                    <button type="button" className={`role-tab ${role === 'designer' ? 'active' : ''}`} onClick={() => setRole('designer')}>Designer</button>
                    <button type="button" className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
                </div>

                <p className="app-description">
                    {role === 'admin' 
                        ? "Administrative access to manage users, designs, and system settings." 
                        : "Help clients visualize furniture in their rooms with stunning 2D and 3D design tools."}
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{role === 'admin' ? 'Admin ID / Email' : 'Designer Email'}</label>
                        <input type="text" name="email" placeholder={role === 'admin' ? "Enter admin handle" : "Enter your email"} value={credentials.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? '🔒' : '👁️'}
                            </span>
                        </div>
                        <div className="forgot-link"><Link to="/forgot-password">Forgot password?</Link></div>
                    </div>

                    <button type="submit" className="login-btn">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</button>
                </form>

                {role === 'designer' && (
                    <p className="register-text">Don't have an account? <Link to="/register">Register now</Link></p>
                )}
            </div>
        </div>
    );
};

export default Login;