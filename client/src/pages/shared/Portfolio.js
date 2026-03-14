import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getMyDesigns, deleteDesign } from '../../api/designs';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All Rooms');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portfolioFavourites') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const data = await getMyDesigns();
      setDesigns(data.designs || []);
    } catch (err) {
      console.error('Failed to load designs:', err);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = (id) => {
    const updated = favourites.includes(id)
      ? favourites.filter(f => f !== id)
      : [...favourites, id];
    setFavourites(updated);
    localStorage.setItem('portfolioFavourites', JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design?')) return;
    try {
      await deleteDesign(id);
      setDesigns(designs.filter(d => d._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleOpen = (design) => {
    localStorage.setItem('currentDesignId', design._id);
    localStorage.setItem('roomSpecs', JSON.stringify(design.roomSpecs));
    navigate('/room-layout');
  };

  const getRoomTag = (design) => {
    const shape = design.roomSpecs?.shape || 'rectangle';
    const map = { rectangle: 'Living', square: 'Bedroom', 'l-shape': 'Office', 'u-shape': 'Dining' };
    return map[shape] || 'Living';
  };

  const filteredDesigns = designs.filter(design => {
    const tag = getRoomTag(design);
    const title = design.title || 'Untitled Design';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All Rooms' || tag === filter;
    const matchesFavourite = !showFavouritesOnly || favourites.includes(design._id);
    return matchesSearch && matchesFilter && matchesFavourite;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleBack = () => navigate('/dashboard');

  const handleNewDesign = () => navigate('/room-setup');

  return (
    <div className="portfolio-page">
      <Navbar userRole={userRole} />

      <div className="portfolio-container">
        <div className="portfolio-header">
          <button className="back-btn-portfolio" onClick={handleBack}>
            ← Dashboard
          </button>
          <h1 className="portfolio-title">My Design Portfolio</h1>
          <button className="new-design-btn" onClick={handleNewDesign}>
            + New Design
          </button>
        </div>

        <div className="portfolio-controls-container">
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by design name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-wrapper">
              <span className="filter-icon">⚲</span>
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

            <button
              className={`favourites-toggle-btn ${showFavouritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            >
              {showFavouritesOnly ? '❤️ Favourites' : '🤍 Show Favourites'}
            </button>
          </div>

          <p className="results-count">
            Showing {filteredDesigns.length} of {designs.length} designs
            {showFavouritesOnly && ` (${favourites.length} favourites)`}
          </p>
        </div>

        {loading ? (
          <div className="empty-favourites">
            <div className="empty-favourites-icon">⏳</div>
            <h3>Loading designs...</h3>
          </div>
        ) : (
          <div className="designs-grid">
            {filteredDesigns.length > 0 ? (
              filteredDesigns.map((design) => (
                <div className="design-card" key={design._id}>
                  <div className="card-image-placeholder">
                    {design.previewImage ? (
                      <img src={design.previewImage} alt={design.title} className="design-preview-img" />
                    ) : (
                      <div className="design-preview-placeholder">
                        <span>🏠</span>
                        <p>{design.canvasItems?.length || 0} items</p>
                      </div>
                    )}
                    <span className="room-tag">{getRoomTag(design)}</span>
                    <button
                      className={`favourite-btn ${favourites.includes(design._id) ? 'active' : ''}`}
                      onClick={() => toggleFavourite(design._id)}
                    >
                      {favourites.includes(design._id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="card-content">
                    <h3 className="design-name">{design.title || 'Untitled Design'}</h3>
                    <p className="customer-name">
                      Shape: {design.roomSpecs?.shape || 'rectangle'} &nbsp;|&nbsp;
                      {design.roomSpecs?.length || 5}m × {design.roomSpecs?.width || 4}m
                    </p>
                    <p className="design-date">
                      <span className="calendar-icon">📅</span> {formatDate(design.updatedAt || design.createdAt)}
                    </p>
                    <p className="design-items-count">
                      🪑 {design.canvasItems?.length || 0} furniture items
                    </p>

                    <div className="card-actions">
                      <button className="action-btn open-btn" onClick={() => handleOpen(design)}>
                        <span className="eye-icon">👁</span> Open
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(design._id)}>
                        <span className="trash-icon">🗑</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-favourites">
                <div className="empty-favourites-icon">
                  {showFavouritesOnly ? '💔' : designs.length === 0 ? '🎨' : '🔍'}
                </div>
                <h3>
                  {showFavouritesOnly ? 'No Favourite Designs' : designs.length === 0 ? 'No Designs Yet' : 'No Designs Found'}
                </h3>
                <p>
                  {designs.length === 0
                    ? 'Start by creating a new design!'
                    : showFavouritesOnly
                      ? 'Click the heart icon on designs to add them to your favourites'
                      : 'Try adjusting your search or filter criteria'}
                </p>
                {designs.length === 0 && (
                  <button className="new-design-btn" onClick={handleNewDesign} style={{ marginTop: '1rem' }}>
                    + Create First Design
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Portfolio;
