import React, { useState, useEffect, useRef } from 'react';
import { getMyDesigns } from '../../api/designs';
import './CompareDesignModal.css';

// Mini canvas preview of a design
const DesignPreview = ({ design }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const specs = design.roomSpecs || {};
    const roomW = specs.length || 5;
    const roomH = specs.width || 4;
    const scaleX = (W - 10) / roomW;
    const scaleY = (H - 10) / roomH;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (W - roomW * scale) / 2;
    const offsetY = (H - roomH * scale) / 2;

    ctx.clearRect(0, 0, W, H);

    // Room floor
    ctx.fillStyle = '#f5f5dc';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.fillRect(offsetX, offsetY, roomW * scale, roomH * scale);
    ctx.strokeRect(offsetX, offsetY, roomW * scale, roomH * scale);

    // Furniture items
    const items = design.canvasItems || [];
    const colors = ['#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2', '#b5ead7', '#c7ceea'];
    items.forEach((item, i) => {
      const x = offsetX + (item.x || 0) * scale;
      const y = offsetY + (item.y || 0) * scale;
      const w = (item.width || 1) * scale;
      const h = (item.height || 1) * scale;
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(((item.rotation || 0) * Math.PI) / 180);
      ctx.fillStyle = colors[i % colors.length];
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    });
  }, [design]);

  return <canvas ref={canvasRef} width={220} height={140} className="design-preview-canvas" />;
};

const CompareDesignModal = ({ isOpen, onClose, currentDesignId, onSelectDesign }) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) fetchDesigns();
  }, [isOpen]);

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const data = await getMyDesigns();
      const all = Array.isArray(data) ? data : (data.designs || []);
      setDesigns(all.filter(d => d._id !== currentDesignId));
    } catch (err) {
      setError('Failed to load designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selected) onSelectDesign(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔍 Compare With Previous Design</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {loading && <div className="loading-state"><p>Loading your designs...</p></div>}
          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchDesigns}>Retry</button>
            </div>
          )}
          {!loading && !error && designs.length === 0 && (
            <div className="empty-state">
              <p>📭 No saved designs found.</p>
              <p>Save a design first to compare.</p>
            </div>
          )}
          {!loading && !error && designs.length > 0 && (
            <div className="design-cards-grid">
              {designs.map(design => (
                <div
                  key={design._id}
                  className={`design-card ${selected?._id === design._id ? 'selected-card' : ''}`}
                  onClick={() => setSelected(design)}
                >
                  <div className="design-preview-wrap">
                    <DesignPreview design={design} />
                    {selected?._id === design._id && (
                      <div className="selected-overlay">✓ Selected</div>
                    )}
                  </div>
                  <div className="design-info">
                    <h3 className="design-name">
                      {design.title || design.name || `Design - ${new Date(design.createdAt).toLocaleDateString()}`}
                    </h3>
                    <p className="design-specs">
                      {design.roomSpecs?.length}m × {design.roomSpecs?.width}m
                      {design.roomSpecs?.shape ? ` · ${design.roomSpecs.shape}` : ''}
                    </p>
                    <p className="design-furniture-count">🪑 {design.canvasItems?.length || 0} items</p>
                    <p className="design-date">{new Date(design.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="select-btn" disabled={!selected} onClick={handleConfirm}>
            Compare Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareDesignModal;
