import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { createDesign } from '../../api/designs';
import './RoomSetup.css';

const RoomSetup = ({ userRole = 'customer' }) => {
  const navigate = useNavigate();
  const actualUserRole = localStorage.getItem('userRole') || userRole;
  const [roomSpecs, setRoomSpecs] = useState({
    length: 5,
    width: 4,
    height: 3,
    unit: 'meters',
    shape: 'rectangle',
    wallColor: '#F5F5DC',
    floorType: 'hardwood'
  });

  const handleInputChange = (field, value) => {
    setRoomSpecs({ ...roomSpecs, [field]: value });
  };

  // Safe parsing for dimensions
  const safeLength = Math.max(1, Math.min(10, parseInt(roomSpecs.length) || 5));
  const safeWidth = Math.max(1, Math.min(10, parseInt(roomSpecs.width) || 4));

  const handleContinue = async () => {
    try {
      const design = await createDesign(roomSpecs);
      localStorage.setItem('roomSpecs', JSON.stringify(roomSpecs));
      localStorage.setItem('currentDesignId', design._id);
      navigate('/room-layout');
    } catch (err) {
      console.error(err);
      localStorage.setItem('roomSpecs', JSON.stringify(roomSpecs));
      localStorage.setItem('currentDesignId', '');
      navigate('/room-layout');
    }
  };

  const handleSave = async () => {
    try {
      const design = await createDesign(roomSpecs);
      localStorage.setItem('roomSpecs', JSON.stringify(roomSpecs));
      localStorage.setItem('currentDesignId', design._id);
      alert('Room specifications saved!');
    } catch (err) {
      console.error(err);
      localStorage.setItem('roomSpecs', JSON.stringify(roomSpecs));
      alert('Saved locally. Backend unavailable.');
    }
  };

  const handleBack = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/admin/products');
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="room-setup-page">
      <Navbar userRole={actualUserRole} />
      
      <div className="room-setup-wrapper">
        <div className="room-setup-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Room Setup</h1>
        </div>

      <div className="room-setup-container">
        <div className="room-specifications">
          <h2>Room Specifications</h2>

          <div className="spec-section">
            <h3>Dimensions</h3>
            <div className="input-row">
              <div className="input-group">
                <label>Length</label>
                <input
                  type="number"
                  value={roomSpecs.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  min="1"
                />
              </div>
              <div className="input-group">
                <label>Width</label>
                <input
                  type="number"
                  value={roomSpecs.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Height</label>
                <input
                  type="number"
                  value={roomSpecs.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  min="1"
                />
              </div>
              <div className="input-group">
                <label>Unit</label>
                <select
                  value={roomSpecs.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                >
                  <option value="meters">Meters</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
            </div>
          </div>

          <div className="spec-section">
            <h3>Room Shape</h3>
            <div className="shape-buttons">
              <button
                className={`shape-btn ${roomSpecs.shape === 'rectangle' ? 'active' : ''}`}
                onClick={() => handleInputChange('shape', 'rectangle')}
              >
                Rectangle
              </button>
              <button
                className={`shape-btn ${roomSpecs.shape === 'square' ? 'active' : ''}`}
                onClick={() => handleInputChange('shape', 'square')}
              >
                Square
              </button>
              <button
                className={`shape-btn ${roomSpecs.shape === 'l-shape' ? 'active' : ''}`}
                onClick={() => handleInputChange('shape', 'l-shape')}
              >
                L-Shape
              </button>
              <button
                className={`shape-btn ${roomSpecs.shape === 'u-shape' ? 'active' : ''}`}
                onClick={() => handleInputChange('shape', 'u-shape')}
              >
                U-Shape
              </button>
            </div>
          </div>

          <div className="spec-section">
            <h3>Wall Color</h3>
            <div className="color-input-group">
              <input
                type="color"
                value={roomSpecs.wallColor}
                onChange={(e) => handleInputChange('wallColor', e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={roomSpecs.wallColor}
                onChange={(e) => handleInputChange('wallColor', e.target.value)}
                className="color-text"
                placeholder="#F5F5DC"
              />
            </div>
          </div>

          <div className="spec-section">
            <h3>Floor Type</h3>
            <select
              value={roomSpecs.floorType}
              onChange={(e) => handleInputChange('floorType', e.target.value)}
              className="floor-select"
            >
              <option value="hardwood">Hardwood</option>
              <option value="tile">Tile</option>
              <option value="carpet">Carpet</option>
              <option value="laminate">Laminate</option>
              <option value="vinyl">Vinyl</option>
            </select>
          </div>

          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              💾 Save
            </button>
            <button className="continue-btn" onClick={handleContinue}>
              Continue to 2D Layout →
            </button>
          </div>
        </div>

        <div className="room-preview">
          <h2>Room Preview</h2>
          <div className="preview-canvas">
            <svg viewBox="0 0 400 400" className="room-svg">
              {/* Render shape based on selection */}
              {roomSpecs.shape === 'rectangle' && (
                <>
                  <rect
                    x="50"
                    y="50"
                    width={safeLength * 50}
                    height={safeWidth * 50}
                    fill={roomSpecs.wallColor}
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <g className="grid-lines">
                    {[...Array(safeLength + 1)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={50 + i * 50}
                        y1="50"
                        x2={50 + i * 50}
                        y2={50 + safeWidth * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                    {[...Array(safeWidth + 1)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="50"
                        y1={50 + i * 50}
                        x2={50 + safeLength * 50}
                        y2={50 + i * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                </>
              )}

              {roomSpecs.shape === 'square' && (
                <>
                  <rect
                    x="75"
                    y="75"
                    width={safeLength * 50}
                    height={safeLength * 50}
                    fill={roomSpecs.wallColor}
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <g className="grid-lines">
                    {[...Array(safeLength + 1)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={75 + i * 50}
                        y1="75"
                        x2={75 + i * 50}
                        y2={75 + safeLength * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                    {[...Array(safeLength + 1)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="75"
                        y1={75 + i * 50}
                        x2={75 + safeLength * 50}
                        y2={75 + i * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                </>
              )}

              {roomSpecs.shape === 'l-shape' && (
                <>
                  <path
                    d={`M 50 50 L ${50 + safeLength * 50} 50 L ${50 + safeLength * 50} ${50 + safeWidth * 25} L ${50 + safeLength * 25} ${50 + safeWidth * 25} L ${50 + safeLength * 25} ${50 + safeWidth * 50} L 50 ${50 + safeWidth * 50} Z`}
                    fill={roomSpecs.wallColor}
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <g className="grid-lines">
                    {[...Array(safeLength + 1)].map((_, i) => (
                      <line
                        key={`v1-${i}`}
                        x1={50 + i * 50}
                        y1="50"
                        x2={50 + i * 50}
                        y2={i <= safeLength / 2 ? 50 + safeWidth * 50 : 50 + safeWidth * 25}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                    {[...Array(safeWidth + 1)].map((_, i) => (
                      <line
                        key={`h1-${i}`}
                        x1="50"
                        y1={50 + i * 50}
                        x2={i <= safeWidth / 2 ? 50 + safeLength * 50 : 50 + safeLength * 25}
                        y2={50 + i * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                </>
              )}

              {roomSpecs.shape === 'u-shape' && (
                <>
                  <path
                    d={`M 50 50 L ${50 + safeLength * 50} 50 L ${50 + safeLength * 50} ${50 + safeWidth * 50} L ${50 + safeLength * 40} ${50 + safeWidth * 50} L ${50 + safeLength * 40} ${50 + safeWidth * 20} L ${50 + safeLength * 10} ${50 + safeWidth * 20} L ${50 + safeLength * 10} ${50 + safeWidth * 50} L 50 ${50 + safeWidth * 50} Z`}
                    fill={roomSpecs.wallColor}
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <g className="grid-lines">
                    {[...Array(safeLength + 1)].map((_, i) => (
                      <line
                        key={`v-u-${i}`}
                        x1={50 + i * 50}
                        y1="50"
                        x2={50 + i * 50}
                        y2={50 + safeWidth * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                        opacity={i > safeLength * 0.2 && i < safeLength * 0.8 ? 0.3 : 1}
                      />
                    ))}
                    {[...Array(safeWidth + 1)].map((_, i) => (
                      <line
                        key={`h-u-${i}`}
                        x1="50"
                        y1={50 + i * 50}
                        x2={50 + safeLength * 50}
                        y2={50 + i * 50}
                        stroke="#ccc"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                </>
              )}

              {/* Dimension labels */}
              <text x="200" y="30" textAnchor="middle" className="dimension-label">
                {safeLength} {roomSpecs.unit}
              </text>
              <text x="30" y="150" textAnchor="middle" className="dimension-label" transform="rotate(-90 30 150)">
                {safeWidth} {roomSpecs.unit}
              </text>
            </svg>
          </div>
          <p className="preview-note">
            This is a top-down view of your room. The grid lines represent {roomSpecs.unit}.
          </p>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomSetup;
