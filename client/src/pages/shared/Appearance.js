import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { updateDesign, getDesign } from '../../api/designs';
import './Appearance.css';

const Appearance = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [settings, setSettings] = useState({
    target: 'room',
    color: '#F5F5DC',
    material: 'wood',
    shading: 'realistic'
  });

  const presetColors = [
    '#F5F5DC', '#E8E8E8', '#CFCFCF', '#C8A97E', '#8E735B', '#9B7B64',
    '#5B3A29', '#4A5568', '#2D3748', '#1A202C', '#C05656', '#718096'
  ];

  const materials = [
  { id: 'wood', label: 'Wood' },
  { id: 'metal', label: 'Metal' },
  { id: 'fabric', label: 'Fabric' },
  { id: 'leather', label: 'Leather' },
  { id: 'glass', label: 'Glass' },
  { id: 'smooth', label: 'Smooth' }
];

    const [designId, setDesignId] = useState(null);
    const [roomSpecs, setRoomSpecs] = useState({});
    const [canvasItems, setCanvasItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // control showing preview comparison
    const [showPreview, setShowPreview] = useState(false);
    const [appliedSettings, setAppliedSettings] = useState({
        color: '#8e4b24',
        material: 'wood'
    });

    useEffect(() => {
        const id = localStorage.getItem('currentDesignId');
        setDesignId(id);

        const loadData = async () => {
            // Load from localStorage first for immediate responsiveness
            const localSpecs = localStorage.getItem('roomSpecs');
            if (localSpecs) {
                const parsed = JSON.parse(localSpecs);
                setRoomSpecs(parsed);
                setSettings(s => ({
                    ...s,
                    color: parsed.wallColor || '#F5F5DC',
                    material: parsed.floorType || 'wood'
                }));
            }

            const localItems = localStorage.getItem('canvasItems');
            if (localItems) setCanvasItems(JSON.parse(localItems));

            if (id) {
                try {
                    const design = await getDesign(id);
                    if (design.roomSpecs) {
                        setRoomSpecs(design.roomSpecs);
                        setSettings(s => ({
                            ...s,
                            color: design.roomSpecs.wallColor || '#F5F5DC',
                            material: design.roomSpecs.floorType || 'wood'
                        }));
                    }
                    if (design.canvasItems) setCanvasItems(design.canvasItems);
                } catch (err) {
                    console.error('Failed to load design:', err);
                }
            }
        };

        loadData();
    }, []);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleApply = async () => {
    setLoading(true);
    try {
        const updatedSpecs = { 
            ...roomSpecs, 
            wallColor: settings.color,
            floorType: settings.material 
        };

        // Update local state and storage
        setRoomSpecs(updatedSpecs);
        localStorage.setItem('roomSpecs', JSON.stringify(updatedSpecs));

        if (designId) {
            await updateDesign(designId, { 
                roomSpecs: updatedSpecs,
                canvasItems: canvasItems 
            });
        }
        
        alert('Appearance settings applied successfully!');
        navigate('/room-3d');
    } catch (err) {
        console.error('Failed to apply settings:', err);
        alert('Failed to save settings. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="appearance-page">
      <Navbar userRole={userRole} />

      <div className="appearance-wrapper">
        <div className="appearance-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Appearance & Shading</h1>
        </div>

      <div className="appearance-container">

        {/* LEFT PANEL */}
        <div className="appearance-left">

          {/* Select Target */}
          <div className="appearance-card">
            <h2>Select Target</h2>
            <div className="target-buttons">
              <button
                className={`target-btn ${settings.target === 'room' ? 'active' : ''}`}
                onClick={() => handleChange('target', 'room')}
              >
                🏠
                <span>Entire Room</span>
              </button>

              <button
                className={`target-btn ${settings.target === 'item' ? 'active' : ''}`}
                onClick={() => handleChange('target', 'item')}
              >
                🪑
                <span>Selected Item</span>
              </button>
            </div>
          </div>

          {/* Color */}
          <div className="appearance-card">
            <h2>Color</h2>

            <div className="custom-color">
              <label>Custom Color</label>
              <div className="color-row">
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={settings.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="color-text"
                />
              </div>
            </div>

            <div className="preset-colors">
              <label>Preset Colors</label>
              <div className="preset-grid">
                {presetColors.map((color, index) => (
                  <div
                    key={index}
                    className={`color-box ${settings.color === color ? 'selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleChange('color', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Material */}
            <div className="appearance-card">
            <h2>Material</h2>

            <div className="material-grid">
                {materials.map((mat) => (
                <button
                    key={mat.id}
                    className={`material-btn ${settings.material === mat.id ? 'active' : ''}`}
                    onClick={() => handleChange('material', mat.id)}
                >
                    <div className={`material-preview ${mat.id}-preview`}></div>
                    {mat.label}
                </button>
                ))}
            </div>
            </div>

            {/* Shading */}
            <div className="appearance-card">
            <h2>Shading Style</h2>
                
            <div className="shading">
              <button
                className={`shading-btn ${settings.shading === 'flat' ? 'active' : ''}`}
                onClick={() => handleChange('shading', 'flat')}
              >
                Flat
                <span><p>No shading, solid colors</p></span>
              </button>

              <button
                className={`shading-btn ${settings.shading === 'smooth' ? 'active' : ''}`}
                onClick={() => handleChange('shading', 'smooth')}
              >
                Smooth
                <span><p>Smooth gradient shading</p></span>
              </button>

              <button
                className={`shading-btn ${settings.shading === 'realistic' ? 'active' : ''}`}
                onClick={() => handleChange('shading', 'realistic')}
              >
                Realistic
                <span><p>Advanced lighting and shadows</p></span>
              </button>
            </div>
            </div>

            <div className="actions">
                <button 
                    className="preview-btn"
                    onClick={() => setShowPreview(true)}
                    >
                    Preview Changes
                </button>

                <button 
                    className="apply-btn" 
                    onClick={handleApply}
                    disabled={loading}
                >
                {loading ? 'Applying...' : '✓ Apply Changes'}
                </button>
            </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="appearance-right">

          {/* Preview */}
        <div className="appearance-card">
        <h2>Preview</h2>

        {/* AFTER CHANGES CARD */}
        {showPreview && (
            <>
            <p className="sub-label">After Changes</p>
            <div 
                className="preview-box"
                style={{
                background:
                    settings.target === 'room'
                    ? settings.color
                    : (roomSpecs.wallColor || '#F5F5DC')
                }}
            >
                <div
                className={`preview-object ${settings.material}`}
                style={{
                    background:
                    settings.target === 'item'
                        ? settings.color
                        : (roomSpecs.floorType === 'carpet' ? '#8B7355' : '#6B5344')
                }}
                ></div>
            </div>
            </>
        )}

        {/* ORIGINAL CARD */}
        <p className="sub-label">Original</p>
        <div 
            className="preview-box"
            style={{ background: roomSpecs.wallColor || '#F5F5DC' }}
        >
            <div
            className={`preview-object ${roomSpecs.floorType || 'wood'}`}
            style={{ background: roomSpecs.floorType === 'carpet' ? '#8B7355' : '#6B5344' }}
            ></div>
        </div>
        </div>

          {/* Current Settings */}
          <div className="appearance-card">
            <h2>Current Settings</h2>

            <div className="settings-row">
              <span>Target:</span>
              <span>{settings.target === 'room' ? 'Room' : 'Selected Item'}</span>
            </div>

            <div className="settings-row">
              <span>Color:</span>
              <div className="color-display">
                <div
                  className="mini-color"
                  style={{ background: settings.color }}
                ></div>
                {settings.color}
              </div>
            </div>

            <div className="settings-row">
              <span>Material:</span>
              <span>{settings.material === 'wood' ? 'Wood' : settings.material === 'metal' ? 'Metal' : settings.material === 'glass' ? 'Glass' : settings.material === 'leather' ? 'Leather' : settings.material === 'smooth' ? 'Smooth' : 'Fabric'}</span>
            </div>

            <div className="settings-row">
              <span>Shading:</span>
              <span>{settings.shading === 'flat' ? 'Flat' : settings.shading === 'smooth' ? 'Smooth' : 'Realistic'}</span>
            </div>
          </div>

          {showPreview && (
            <div className="confirm-actions">
                <button 
                className="cancel-btn"
                onClick={() => setShowPreview(false)}
                >
                Cancel
                </button>

                <button 
                className="confirm-btn"
                onClick={handleApply}
                disabled={loading}
                >
                {loading ? 'Saving...' : 'Confirm & Apply'}
                </button>
            </div>
            )}

        </div>

      </div>

      <Footer />
      </div>
    </div>
  );
};

export default Appearance;