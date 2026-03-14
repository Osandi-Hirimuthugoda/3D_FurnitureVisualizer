import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import './Settings.css';

const API_URL = 'http://localhost:5001/api';

const Settings = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        organization: ''
    });

    const [appSettings, setAppSettings] = useState({
        theme: 'light',
        unit: 'meters',
        defaultRoom: 'Living Room'
    });

    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [profileMsg, setProfileMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Load current user from backend
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setProfile({
                        name: data.user.fullName || '',
                        email: data.user.email || '',
                        organization: data.user.organization || ''
                    });
                }
            } catch (err) {
                console.error('Failed to load user:', err);
            }
        };
        fetchUser();
    }, [token]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleSaveProfile = async () => {
        setProfileLoading(true);
        setProfileMsg('');
        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: profile.name,
                    organization: profile.organization
                })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('userName', data.user.fullName);
                setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setProfileMsg({ type: 'error', text: data.message });
            }
        } catch (err) {
            setProfileMsg({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordMsg('');
        if (passwords.new !== passwords.confirm) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        if (passwords.new.length < 8) {
            setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }
        setPasswordLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwords.old,
                    newPassword: passwords.new
                })
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
                setPasswords({ old: '', new: '', confirm: '' });
            } else {
                setPasswordMsg({ type: 'error', text: data.message });
            }
        } catch (err) {
            setPasswordMsg({ type: 'error', text: 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const [expandedFaq, setExpandedFaq] = useState(null);
    const toggleFaq = (index) => setExpandedFaq(expandedFaq === index ? null : index);

    const faqs = [
        { question: 'How do I create a new room design?', answer: 'Navigate to the Dashboard and click "Create New Design" to enter the Room Setup wizard.' },
        { question: 'How do I use the 2D layout editor?', answer: 'Drag and drop furniture from the side panel into your room layout. You can rotate and resize items using the handles.' },
        { question: 'How do I view my design in 3D?', answer: 'Once happy with your 2D layout, click the "View in 3D" button to see a realistic render of your room.' },
        { question: 'Can I save multiple designs?', answer: 'Yes! Click "Save Design" while working on a layout. View all saved work in the "My Design Portfolio" page.' }
    ];

    return (
        <div className="settings-page">
            <Navbar userRole={userRole} />

            <div className="settings-container">
                <div className="settings-header">
                    <button className="back-btn-settings" onClick={handleBack}>
                        ← Back to Dashboard
                    </button>
                    <h1 className="settings-title">Settings & Help</h1>
                    <div style={{ width: '150px' }}></div>
                </div>

                <div className="settings-content">

                    {/* Profile Settings */}
                    <div className="settings-card">
                        <div className="card-header">
                            <span className="section-icon">👤</span>
                            <h2>Profile Settings</h2>
                        </div>

                        {profileMsg && (
                            <div className={`settings-msg ${profileMsg.type}`}>
                                {profileMsg.text}
                            </div>
                        )}

                        <div className="form-group row-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group row-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group row-group">
                            <label>Organization</label>
                            <input
                                type="text"
                                value={profile.organization}
                                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                                placeholder="Your company or organization"
                            />
                        </div>

                        <button className="primary-btn" onClick={handleSaveProfile} disabled={profileLoading}>
                            {profileLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>

                    {/* Change Password */}
                    <div className="settings-card">
                        <h2>Change Password</h2>

                        {passwordMsg && (
                            <div className={`settings-msg ${passwordMsg.type}`}>
                                {passwordMsg.text}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwords.old}
                                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    placeholder="Min 8 characters"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>

                        <button className="secondary-btn-dark" onClick={handleChangePassword} disabled={passwordLoading}>
                            {passwordLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>

                    {/* Application Settings */}
                    <div className="settings-card">
                        <h2>Application Settings</h2>

                        <div className="form-group">
                            <label>Theme</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${appSettings.theme === 'light' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, theme: 'light' })}>
                                    Light Mode
                                </button>
                                <button className={`toggle-btn ${appSettings.theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, theme: 'dark' })}>
                                    Dark Mode
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Default Measurement Unit</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${appSettings.unit === 'meters' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, unit: 'meters' })}>
                                    Meters (m)
                                </button>
                                <button className={`toggle-btn ${appSettings.unit === 'feet' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, unit: 'feet' })}>
                                    Feet (ft)
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Default Room Shape</label>
                            <div className="select-wrapper">
                                <select value={appSettings.defaultRoom}
                                    onChange={(e) => setAppSettings({ ...appSettings, defaultRoom: e.target.value })}>
                                    <option value="Living Room">Rectangle Room</option>
                                    <option value="Bedroom">Square Room</option>
                                    <option value="Office">L-Shape Room</option>
                                </select>
                                <span className="select-arrow">▼</span>
                            </div>
                        </div>

                        <button className="primary-btn"
                            onClick={() => alert('Settings saved!')}>
                            Save Settings
                        </button>
                    </div>

                    {/* Help & Support */}
                    <div className="settings-card help-card">
                        <div className="card-header">
                            <span className="section-icon">❔</span>
                            <h2>Help & Support</h2>
                        </div>

                        <div className="faq-section">
                            <label>Frequently Asked Questions</label>
                            {faqs.map((faq, index) => (
                                <div className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`} key={index}>
                                    <button className="faq-question" onClick={() => toggleFaq(index)}>
                                        {faq.question}
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="faq-answer"><p>{faq.answer}</p></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="contact-support-box">
                            <h3>Need More Help?</h3>
                            <p>Our support team is here to help you with any questions or issues.</p>
                            <button className="secondary-btn-dark">Contact Support</button>
                        </div>

                        <div className="quick-tips-box">
                            <div className="tips-header"><h3>Quick Tips</h3></div>
                            <p>Hold Shift while dragging furniture to snap it to the grid.</p>
                            <p>Use the scroll wheel in 3D mode to zoom in and out.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;

