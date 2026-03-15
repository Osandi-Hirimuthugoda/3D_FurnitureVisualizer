import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDesign } from '../../api/designs';
import Navbar from '../../components/shared/Navbar';
import './DesignComparison.css';

const DesignComparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const [layoutA, setLayoutA] = useState(null);
  const [layoutB, setLayoutB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomShape, setRoomShape] = useState('rectangle');

  useEffect(() => {
    const loadLayouts = async () => {
      try {
        const designA = location.state?.designA;
        const designB = location.state?.designB;

        if (!designA || !designB) {
          setError('Missing design IDs for comparison.');
          return;
        }

        const [designAData, designBData] = await Promise.all([
          getDesign(designA),
          getDesign(designB)
        ]);

        setLayoutA(designAData);
        setLayoutB(designBData);
        setRoomShape(designAData?.roomSpecs?.shape || 'rectangle');
      } catch (err) {
        console.error('Failed to load designs:', err);
        setError('Failed to load designs for comparison.');
      } finally {
        setLoading(false);
      }
    };

    loadLayouts();
  }, [location.state]);

  const getRoomSVG = (shape = 'rectangle', width = 500, height = 400) => {
    switch (shape) {
      case 'square':
        return (
          <rect x="50" y="0" width="400" height="400" fill="#f5f5dc" stroke="#333" strokeWidth="3" />
        );
      case 'l-shape':
        return (
          <path
            d="M0 0 L500 0 L500 200 L250 200 L250 400 L0 400 Z"
            fill="#f5f5dc"
            stroke="#333"
            strokeWidth="3"
          />
        );
      case 'u-shape':
        return (
          <path
            d="M0 0 L500 0 L500 400 L400 400 L400 160 L100 160 L100 400 L0 400 Z"
            fill="#f5f5dc"
            stroke="#333"
            strokeWidth="3"
          />
        );
      default:
        return (
          <rect x="0" y="0" width="500" height="400" fill="#f5f5dc" stroke="#333" strokeWidth="3" />
        );
    }
  };

  const renderCanvas = (layout) => {
    if (!layout) return null;

    const shape = layout.roomSpecs?.shape || 'rectangle';

    return (
      <div className="canvas-wrapper">
        <svg
          className="room-svg"
          viewBox="0 0 500 400"
          preserveAspectRatio="none"
        >
          {getRoomSVG(shape)}
        </svg>
        <div className="canvas-grid">
          {layout.canvasItems.map((item) => (
            <div
              key={item.canvasId}
              className="canvas-item comparison-item"
              style={{
                left: `${item.x * 50}px`,
                top: `${item.y * 50}px`,
                width: `${item.width * 50}px`,
                height: `${item.height * 50}px`,
                transform: `rotate(${item.rotation}deg)`
              }}
            >
              {item.image ? (
                item.image.startsWith('data:image') || item.image.startsWith('http') ? (
                  <img src={item.image} alt={item.name} className="canvas-item-image" />
                ) : (
                  <span className="canvas-item-emoji">{item.image}</span>
                )
              ) : (
                <span className="canvas-item-emoji">🪑</span>
              )}
              <div className="item-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar userRole={userRole} />
        <div className="design-comparison-container">
          <div className="loading-state">
            <p>Loading designs for comparison...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !layoutA || !layoutB) {
    return (
      <>
        <Navbar userRole={userRole} />
        <div className="design-comparison-container">
          <div className="error-state">
            <p>{error || 'Failed to load designs for comparison.'}</p>
            <button className="back-btn" onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userRole={userRole} />
      <div className="design-comparison-page">
        <header className="comparison-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Design Comparison</h1>
          <div className="header-spacer"></div>
          <button
            className="compare-3d-btn"
            onClick={() => navigate('/design-comparison-3d', {
              state: {
                designA: location.state?.designA,
                designB: location.state?.designB
              }
            })}
          >
            👁️ View in 3D
          </button>
        </header>

        <div className="design-comparison-container">
          {/* Design A - Current/Left */}
          <div className="comparison-section">
            <div className="section-header">
              <h2>Design A (Current)</h2>
              <span className="section-badge primary">Current Layout</span>
            </div>
            <div className="canvas-container">
              {renderCanvas(layoutA)}
            </div>
            <div className="design-stats">
              <div className="stat-item">
                <span className="stat-label">Room Size:</span>
                <span className="stat-value">
                  {layoutA.roomSpecs?.length}m × {layoutA.roomSpecs?.width}m
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Room Shape:</span>
                <span className="stat-value">{layoutA.roomSpecs?.shape || 'Rectangle'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Furniture Count:</span>
                <span className="stat-value">{layoutA.canvasItems?.length || 0} items</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Created:</span>
                <span className="stat-value">
                  {new Date(layoutA.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="comparison-divider"></div>

          {/* Design B - Selected/Right */}
          <div className="comparison-section">
            <div className="section-header">
              <h2>Design B (Selected)</h2>
              <span className="section-badge secondary">Comparison Design</span>
            </div>
            <div className="canvas-container">
              {renderCanvas(layoutB)}
            </div>
            <div className="design-stats">
              <div className="stat-item">
                <span className="stat-label">Room Size:</span>
                <span className="stat-value">
                  {layoutB.roomSpecs?.length}m × {layoutB.roomSpecs?.width}m
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Room Shape:</span>
                <span className="stat-value">{layoutB.roomSpecs?.shape || 'Rectangle'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Furniture Count:</span>
                <span className="stat-value">{layoutB.canvasItems?.length || 0} items</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Created:</span>
                <span className="stat-value">
                  {new Date(layoutB.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="comparison-summary">
          <h3>Comparison Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Furniture Difference:</span>
              <span className={`summary-value ${Math.abs(layoutA.canvasItems?.length - layoutB.canvasItems?.length) > 0 ? 'different' : 'same'}`}>
                {Math.abs((layoutA.canvasItems?.length || 0) - (layoutB.canvasItems?.length || 0))} items
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Room Size Match:</span>
              <span className={`summary-value ${layoutA.roomSpecs?.length === layoutB.roomSpecs?.length && layoutA.roomSpecs?.width === layoutB.roomSpecs?.width ? 'same' : 'different'}`}>
                {layoutA.roomSpecs?.length === layoutB.roomSpecs?.length && layoutA.roomSpecs?.width === layoutB.roomSpecs?.width ? 'Identical' : 'Different'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignComparison;
