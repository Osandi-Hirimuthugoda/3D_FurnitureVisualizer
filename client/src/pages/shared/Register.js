import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        organization: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Password confirm පරීක්ෂා කිරීම
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Account Created:", formData);
        alert("Account successfully created!");
        navigate('/login');
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-logo">
                    <img
                        src={process.env.PUBLIC_URL + '/logo_black.png'}
                        alt="Living Trend"
                        className="register-logo-img"
                    />
                </div>

                <h2>Create Designer Account</h2>
                <p className="subtitle">Join our platform to create stunning room designs</p>

                <div className="profile-upload-section">
                    <div className="profile-placeholder">
                        <i className="user-icon">👤</i>
                        <label htmlFor="file-upload" className="upload-badge">
                            ↑
                        </label>
                        <input id="file-upload" type="file" style={{ display: 'none' }} />
                    </div>
                    <p className="upload-text">Profile picture (optional)</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input 
                                type="text" name="fullName" placeholder="John Doe" 
                                onChange={handleChange} required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input 
                                type="email" name="email" placeholder="john@example.com" 
                                onChange={handleChange} required 
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Organization / Store Name</label>
                        <input 
                            type="text" name="organization" placeholder="Design Studio Inc." 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-row">
                        <div className="form-group">
                            <label>Password *</label>
                            <input 
                                type="password" name="password" placeholder="********" 
                                onChange={handleChange} required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password *</label>
                            <input 
                                type="password" name="confirmPassword" placeholder="********" 
                                onChange={handleChange} required 
                            />
                        </div>
                    </div>

                    <div className="password-rules">
                        <p>Password Requirements:</p>
                        <ul>
                            <li>At least 8 characters long</li>
                            <li>Contains at least one uppercase letter</li>
                            <li>Contains at least one lowercase letter</li>
                            <li>Contains at least one number</li>
                        </ul>
                    </div>

                    <button type="submit" className="register-btn">Create Account</button>
                </form>

                <p className="login-footer">
                    Already have an account? <Link to="/login" className="link-button">Log in</Link>
                </p>
                
                {/* අමතර auth-action කොටස මෙතැනින් ඉවත් කරන ලදී */}
            </div>
        </div>
    );
};

export default Register;