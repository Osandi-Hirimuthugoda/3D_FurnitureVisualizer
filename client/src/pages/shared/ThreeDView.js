import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import './ThreeDView.css';

const cameraOptions = [
  { id: 'perspective', label: 'Perspective View', description: 'Immersive angled view of the entire room.' },
  { id: 'front', label: 'Front View', description: 'Look straight at the main wall.' },
  { id: 'side', label: 'Side View', description: 'Focus on the side wall and furniture depth.' },
  { id: 'top', label: 'Top View', description: 'Bird\u2019s eye view of your layout.' }
];

const lightingOptions = [
  { id: 'day', label: 'Natural Daylight' },
  { id: 'evening', label: 'Warm Evening' },
  { id: 'cool', label: 'Cool Office' },
  { id: 'spotlight', label: 'Dramatic Spotlight' }
];

const ThreeDView = () => {
  const navigate = useNavigate();

  const [activeCamera, setActiveCamera] = useState('perspective');
  const [activeLighting, setActiveLighting] = useState('day');
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [shadowQuality, setShadowQuality] = useState(80);
  const [viewMode, setViewMode] = useState('3d');
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleBackTo2D = () => {
    navigate('/room-layout');
  };

  const handleOpenAppearance = () => {
    navigate('/appearance');
  };

  const handleZoomChange = (direction) => {
    setZoomLevel((current) => {
      const delta = direction === 'in' ? 0.15 : -0.15;
      const next = current + delta;
      if (next < 0.8) return 0.8;
      if (next > 1.4) return 1.4;
      return next;
    });
  };

  const currentCamera = cameraOptions.find((option) => option.id === activeCamera);
  const currentLighting = lightingOptions.find((option) => option.id === activeLighting);

  const shadowLabel =
    shadowQuality >= 75 ? 'High' : shadowQuality >= 45 ? 'Medium' : 'Low';

  return (
    <>
      <Sidebar />
      <div className="three-d-page with-sidebar">
        <header className="three-d-header">
          <button className="back-btn" onClick={handleBackTo2D}>
            ← Back to 2D Layout
          </button>

          <div className="three-d-header-center">
            <h1>3D Room Visualization</h1>
            <span className="current-view-pill">
              Current view: {currentCamera?.label}
            </span>
          </div>

          <button className="appearance-btn" onClick={handleOpenAppearance}>
            Appearance
          </button>
        </header>

        <div className="three-d-content">
          {/* LEFT PANEL \u2013 Controls */}
          <aside className="three-d-controls">
            <section className="control-section">
              <div className="control-header">
                <h3>Camera Angles</h3>
                <p className="control-subtitle">
                  Choose how you want to explore the room.
                </p>
              </div>

              <div className="pill-group">
                {cameraOptions.map((camera) => (
                  <button
                    key={camera.id}
                    className={`pill-button ${
                      activeCamera === camera.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveCamera(camera.id)}
                  >
                    <span className="pill-label">{camera.label}</span>
                    <span className="pill-description">{camera.description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="control-section">
              <div className="control-header">
                <h3>Lighting Presets</h3>
                <p className="control-subtitle">
                  Quickly preview your room under different moods.
                </p>
              </div>

              <div className="list-group">
                {lightingOptions.map((lighting) => (
                  <button
                    key={lighting.id}
                    className={`list-button ${
                      activeLighting === lighting.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveLighting(lighting.id)}
                  >
                    <span className="dot" />
                    <span className="list-label">{lighting.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="control-section">
              <div className="control-header">
                <h3>Rendering Options</h3>
                <p className="control-subtitle">
                  Adjust realism for performance or visual quality.
                </p>
              </div>

              <div className="control-row shadows-row">
                <div>
                  <span className="row-label">Shadows</span>
                  <p className="row-description">
                    Soft contact shadows under furniture and along walls.
                  </p>
                </div>

                <button
                  className={`toggle-switch ${
                    shadowsEnabled ? 'enabled' : 'disabled'
                  }`}
                  onClick={() => setShadowsEnabled(!shadowsEnabled)}
                  aria-pressed={shadowsEnabled}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              <div className="control-row slider-row">
                <div className="slider-labels">
                  <span className="row-label">Shadow quality</span>
                  <span className="slider-value">
                    {shadowLabel} ({shadowQuality}%)
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={shadowQuality}
                  onChange={(e) => setShadowQuality(Number(e.target.value))}
                  className="shadow-slider"
                />
              </div>
            </section>

            <section className="control-section">
              <div className="control-header">
                <h3>View Mode</h3>
              </div>

              <div className="pill-group vertical">
                <button
                  className={`pill-button compact ${
                    viewMode === '3d' ? 'active' : ''
                  }`}
                  onClick={() => setViewMode('3d')}
                >
                  <span className="pill-label">3D View</span>
                  <span className="pill-description">
                    Rotate, orbit and zoom around the room.
                  </span>
                </button>

                <button
                  className="pill-button compact secondary"
                  onClick={handleBackTo2D}
                >
                  <span className="pill-label">Switch to 2D Layout</span>
                  <span className="pill-description">
                    Go back to precise top-down editing.
                  </span>
                </button>
              </div>
            </section>
          </aside>

          {/* RIGHT PANEL \u2013 3D Room Preview */}
          <main className="three-d-viewport-area">
            <div className="three-d-status-row">
              <span className="status-chip">
                Camera: {currentCamera?.label}
              </span>
              <span className="status-chip">
                Lighting: {currentLighting?.label}
              </span>
              <span className="status-chip">
                Shadows: {shadowsEnabled ? 'On' : 'Off'} ({shadowLabel})
              </span>
            </div>

            <div className="three-d-viewport-wrapper">
              <div
                className={`room-scene ${activeLighting}`}
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="room-back-wall" />
                <div className="room-side-wall left" />
                <div className="room-side-wall right" />
                <div className="room-floor" />

                <div className="room-window">
                  <div className="window-pane" />
                  <div className="window-pane" />
                  <div className="window-pane" />
                  <div className="window-pane" />
                </div>

                <div className="room-sofa">
                  <div className="sofa-back" />
                  <div className="sofa-seat" />
                </div>

                <div className="room-table">
                  <div className="table-top" />
                  <div className="table-leg" />
                  <div className="table-leg right" />
                </div>

                <div className="room-plant">
                  <div className="plant-pot" />
                  <div className="plant-leaf" />
                  <div className="plant-leaf right" />
                </div>
              </div>
            </div>

            <div className="three-d-viewport-footer">

              <div className="zoom-controls">
                <button
                  className="zoom-btn"
                  onClick={() => handleZoomChange('out')}
                  aria-label="Zoom out"
                >-
                </button>
                <span className="zoom-label">Zoom</span>
                <button
                  className="zoom-btn"
                  onClick={() => handleZoomChange('in')}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  className="zoom-btn reset"
                  onClick={() => setZoomLevel(1)}
                >
                  Reset
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ThreeDView;

