import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All Rooms');

  // Dummy data based on screenshot
  const designs = [
    { id: 1, title: 'Modern Living Room', customer: 'Sarah Johnson', date: 'Feb 10, 2026', tag: 'Living' },
    { id: 2, title: 'Cozy Bedroom Design', customer: 'Michael Chen', date: 'Feb 9, 2026', tag: 'Bedroom' },
    { id: 3, title: 'Minimalist Office', customer: 'Emma Williams', date: 'Feb 8, 2026', tag: 'Office' },
    { id: 4, title: 'Elegant Dining Room', customer: 'James Anderson', date: 'Feb 7, 2026', tag: 'Dining' },
    { id: 5, title: 'Contemporary Kitchen', customer: 'Lisa Martinez', date: 'Feb 6, 2026', tag: 'Kitchen' },
    { id: 6, title: 'Scandinavian Living', customer: 'David Thompson', date: 'Feb 5, 2026', tag: 'Living' },
  ];

  const handleBack = () => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleNewDesign = () => {
    if (userRole === 'admin') {
      navigate('/admin/room-setup');
    } else {
      navigate('/room-setup');
    }
  };

  return (
    <div className="portfolio-page">
      <Navbar userRole={userRole} />

      <div className="portfolio-container">
        {/* Header Section */}
        <div className="portfolio-header">
          <button className="back-btn-portfolio" onClick={handleBack}>
            ← Dashboard
          </button>
          
          <h1 className="portfolio-title">My Design Portfolio</h1>
          
          <button className="new-design-btn" onClick={handleNewDesign}>
            + New Design
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="portfolio-controls-container">
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by room name or customer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-wrapper">
               <span className="filter-icon">⚲</span> {/* Generic filter icon representation */}
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="room-filter-dropdown"
              >
                <option value="All Rooms">All Rooms</option>
                <option value="Living">Living</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Office">Office</option>
                <option value="Dining">Dining</option>
                <option value="Kitchen">Kitchen</option>
              </select>
            </div>
          </div>
          
          <p className="results-count">Showing {designs.length} of {designs.length} designs</p>
        </div>

        {/* Designs Grid */}
        <div className="designs-grid">
          {designs.map((design) => (
            <div className="design-card" key={design.id}>
              {/* Image Placeholder */}
              <div className="card-image-placeholder">
                <span className="room-tag">{design.tag}</span>
              </div>
              
              {/* Card Details */}
              <div className="card-content">
                <h3 className="design-name">{design.title}</h3>
                
                {/* Only show customer name if applicable or based on role, but we'll show it as in mock */}
                <p className="customer-name">Customer: {design.customer}</p>
                
                <p className="design-date">
                  <span className="calendar-icon">📅</span> {design.date}
                </p>
                
                {/* Action Buttons */}
                <div className="card-actions">
                  <button className="action-btn open-btn" aria-label="Open">
                    <span className="eye-icon">👁</span> Open
                  </button>
                  <button className="action-btn duplicate-btn" aria-label="Duplicate">
                    <span className="copy-icon">📋</span>
                  </button>
                  <button className="action-btn delete-btn" aria-label="Delete">
                    <span className="trash-icon">🗑</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
