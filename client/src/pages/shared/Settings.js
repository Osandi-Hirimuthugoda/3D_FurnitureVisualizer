import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    // Profile State
    const [profile, setProfile] = useState({
        name: userRole === 'admin' ? 'Admin Designer' : 'Demo Customer',
        email: userRole === 'admin' ? 'admin@furnitureviz.com' : 'demo@example.com'
    });

    // App Settings State
    const [appSettings, setAppSettings] = useState({
        theme: 'light',
        unit: 'meters',
        defaultRoom: 'Living Room'
    });

    // Password State
    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        confirm: ''
    });

    const handleBack = () => {
        navigate('/dashboard');
    };

    const [expandedFaq, setExpandedFaq] = useState(null);

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const faqs = [
        { question: 'How do I create a new room design?', answer: 'Navigate to the Dashboard or Home page and click "Create New Design" to enter the Room Setup wizard.' },
        { question: 'How do I use the 2D layout editor?', answer: 'Drag and drop furniture from the side panel into your room layout. You can rotate and resize items using the handles that appear when an item is selected.' },
        { question: 'How do I view my design in 3D?', answer: 'Once you are happy with your 2D layout, click the "View in 3D" button to see a realistic render of your room.' },
        { question: 'Can I save multiple designs?', answer: 'Yes! Simply click "Save Design" while working on a layout. You can view all your saved work in the "My Design Portfolio" page.' }
    ];

    return (
        <div className="settings-page">
            <Navbar userRole={userRole} />

            <div className="settings-container">
                {/* Header Section */}
                <div className="settings-header">
                    <button className="back-btn-settings" onClick={handleBack}>
                        ← Back to Dashboard
                    </button>

                    <h1 className="settings-title">Settings & Help</h1>
                    <div style={{ width: '150px' }}></div> {/* Empty div for centering title */}
                </div>

                <div className="settings-content">

                    {/* Profile Settings */}
                    <div className="settings-card">
                        <div className="card-header">
                            <span className="section-icon">👤</span>
                            <h2>Profile Settings</h2>
                        </div>

                        <div className="form-group row-group">
                            <label>Name</label>
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
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>

                        <button className="primary-btn">
                            Save Profile
                        </button>
                    </div>

                    {/* Change Password */}
                    <div className="settings-card">
                        <h2>Change Password</h2>

                        <div className="form-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={passwords.old}
                                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>

                            <div className="form-group half-width">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="secondary-btn-dark">Change Password</button>
                    </div>

                    {/* Application Settings */}
                    <div className="settings-card">
                        <h2>Application Settings</h2>

                        <div className="form-group">
                            <label>Theme</label>
                            <div className="toggle-group">
                                <button
                                    className={`toggle-btn ${appSettings.theme === 'light' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, theme: 'light' })}
                                >
                                    Light Mode
                                </button>
                                <button
                                    className={`toggle-btn ${appSettings.theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, theme: 'dark' })}
                                >
                                    Dark Mode
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Default Measurement Unit</label>
                            <div className="toggle-group">
                                <button
                                    className={`toggle-btn ${appSettings.unit === 'meters' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, unit: 'meters' })}
                                >
                                    Meters (m)
                                </button>
                                <button
                                    className={`toggle-btn ${appSettings.unit === 'feet' ? 'active' : ''}`}
                                    onClick={() => setAppSettings({ ...appSettings, unit: 'feet' })}
                                >
                                    Feet (ft)
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Default Room Shape</label>
                            <div className="select-wrapper">
                                <select
                                    value={appSettings.defaultRoom}
                                    onChange={(e) => setAppSettings({ ...appSettings, defaultRoom: e.target.value })}
                                >
                                    <option value="Living Room">Rectangle Room</option>
                                    <option value="Bedroom">Square Room</option>
                                    <option value="Office">L-Shape Room</option>
                                </select>
                                <span className="select-arrow">▼</span>
                            </div>
                        </div>

                        <button className="primary-btn">
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
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
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
                            <div className="tips-header">
                                <h3>Quick Tips</h3>
                            </div>
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
