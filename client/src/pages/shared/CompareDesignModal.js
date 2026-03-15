import React, { useState, useEffect } from 'react';
import { getUserDesigns } from '../../api/designs';
import './CompareDesignModal.css';

const CompareDesignModal = ({ isOpen, onClose, currentDesignId, userId, onSelectDesign }) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDesigns();
    }
  }, [isOpen, userId]);

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const userDesigns = await getUserDesigns(userId);
      // Filter out the current design
      const filteredDesigns = userDesigns.filter(design => design._id !== currentDesignId);
      setDesigns(filteredDesigns);
    } catch (err) {
      console.error('Failed to fetch designs:', err);
      setError('Failed to load designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDesign = (design) => {
    onSelectDesign(design);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="compare-modal">
        <div className="modal-header">
          <h2>🔍 Compare With Previous Design</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {loading && (
            <div className="loading-state">
              <p>Loading designs...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchDesigns}>Retry</button>
            </div>
          )}

          {!loading && !error && designs.length === 0 && (
            <div className="empty-state">
              <p>No previous designs to compare with.</p>
              <p>Create and save a design first to enable comparison.</p>
            </div>
          )}

          {!loading && !error && designs.length > 0 && (
            <div className="design-cards-grid">
              {designs.map((design) => (
                <div key={design._id} className="design-card">
                  <div className="design-card-content">
                    <div className="design-preview">
                      <div className="preview-placeholder">
                        <span className="preview-icon">🎨</span>
                      </div>
                    </div>
                    <div className="design-info">
                      <h3 className="design-name">
                        {design.name || `Room Design - ${new Date(design.createdAt).toLocaleDateString()}`}
                      </h3>
                      {design.roomSpecs && (
                        <p className="design-specs">
                          {design.roomSpecs.length}m × {design.roomSpecs.width}m
                        </p>
                      )}
                      {design.roomSpecs && design.roomSpecs.shape && (
                        <p className="design-shape">
                          Shape: {design.roomSpecs.shape}
                        </p>
                      )}
                      <p className="design-furniture-count">
                        🪑 {design.canvasItems?.length || 0} items
                      </p>
                      <p className="design-date">
                        {new Date(design.createdAt).toLocaleDateString()} {new Date(design.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    className="select-btn"
                    onClick={() => handleSelectDesign(design)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CompareDesignModal;
