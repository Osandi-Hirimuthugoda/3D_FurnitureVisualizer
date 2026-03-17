import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { updateDesign, getDesign } from '../../api/designs';
import './Appearance.css';

const colors = { sofas: '#D4A574', chairs: '#8B7355', tables: '#87CEEB', beds: '#C4B896', desks: '#708090' };

const Appearance = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [settings, setSettings] = useState({
    target: 'room',
    color: '#F5F5DC',
    material: 'wood',
    shading: 'realistic'
  });

  const [selectedItemId, setSelectedItemId] = useState(null);

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
    // Loading state
    const [loading, setLoading] = useState(false);

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
        let updatedSpecs = { ...roomSpecs };
        let updatedItems = [...canvasItems];

        if (settings.target === 'room') {
            updatedSpecs = { 
                ...roomSpecs, 
                wallColor: settings.color,
                floorType: settings.material 
            };
            setRoomSpecs(updatedSpecs);
            localStorage.setItem('roomSpecs', JSON.stringify(updatedSpecs));
        } else if (settings.target === 'item' && selectedItemId) {
            updatedItems = canvasItems.map(item => 
                item.canvasId === selectedItemId || item._id === selectedItemId 
                ? { ...item, color: settings.color, material: settings.material }
                : item
            );
            setCanvasItems(updatedItems);
            localStorage.setItem('canvasItems', JSON.stringify(updatedItems));
        }

        if (designId) {
            await updateDesign(designId, { 
                roomSpecs: updatedSpecs,
                canvasItems: updatedItems 
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

        {/* LEFT PANEL - Live Preview */}
        <div className="appearance-left">

          {/* Preview */}
          <div className="appearance-card preview-card">
            <h2>Live Preview</h2>

            <p className="sub-label">Wall Colour Preview</p>
            <div className="room-svg-preview-wrapper">
              <svg viewBox="0 0 300 240" className="room-svg-preview">
                <rect x="30" y="30" width="240" height="180" fill={roomSpecs.floorType === 'carpet' ? '#8B7355' : '#6B5344'} />
                <rect x="30" y="30" width="240" height="10" fill={settings.target === 'room' ? settings.color : (roomSpecs.wallColor || '#F5F5DC')} />
                <rect x="30" y="30" width="10" height="180" fill={settings.target === 'room' ? settings.color : (roomSpecs.wallColor || '#F5F5DC')} />
                <rect x="260" y="30" width="10" height="180" fill={settings.target === 'room' ? settings.color : (roomSpecs.wallColor || '#F5F5DC')} />
                <rect x="30" y="30" width="240" height="180" fill="none" stroke="#333" strokeWidth="2" />
                <rect x="80" y="140" width="80" height="40" rx="4" fill="rgba(0,0,0,0.15)" />
                <rect x="170" y="150" width="40" height="30" rx="4" fill="rgba(0,0,0,0.12)" />
                <rect x="100" y="60" width="60" height="40" rx="4" fill="rgba(0,0,0,0.12)" />
                <text x="150" y="22" textAnchor="middle" fontSize="11" fill="#555" fontWeight="600">{roomSpecs.length || 5}m</text>
                <text x="18" y="125" textAnchor="middle" fontSize="11" fill="#555" fontWeight="600" transform="rotate(-90 18 125)">{roomSpecs.width || 4}m</text>
              </svg>
            </div>

            <p className="sub-label">Original</p>
            <div className="room-svg-preview-wrapper">
              <svg viewBox="0 0 300 240" className="room-svg-preview">
                <rect x="30" y="30" width="240" height="180" fill={roomSpecs.floorType === 'carpet' ? '#8B7355' : '#6B5344'} />
                <rect x="30" y="30" width="240" height="10" fill={roomSpecs.wallColor || '#F5F5DC'} />
                <rect x="30" y="30" width="10" height="180" fill={roomSpecs.wallColor || '#F5F5DC'} />
                <rect x="260" y="30" width="10" height="180" fill={roomSpecs.wallColor || '#F5F5DC'} />
                <rect x="30" y="30" width="240" height="180" fill="none" stroke="#333" strokeWidth="2" />
                <rect x="80" y="140" width="80" height="40" rx="4" fill="rgba(0,0,0,0.15)" />
                <rect x="170" y="150" width="40" height="30" rx="4" fill="rgba(0,0,0,0.12)" />
                <rect x="100" y="60" width="60" height="40" rx="4" fill="rgba(0,0,0,0.12)" />
                <text x="150" y="22" textAnchor="middle" fontSize="11" fill="#555" fontWeight="600">{roomSpecs.length || 5}m</text>
                <text x="18" y="125" textAnchor="middle" fontSize="11" fill="#555" fontWeight="600" transform="rotate(-90 18 125)">{roomSpecs.width || 4}m</text>
              </svg>
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
                <div className="mini-color" style={{ background: settings.color }}></div>
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

        </div>

        {/* RIGHT PANEL - Controls */}
        <div className="appearance-right">

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
                onClick={() => {
                  handleChange('target', 'item');
                  if (canvasItems.length > 0 && !selectedItemId) {
                    const firstItem = canvasItems[0];
                    const id = firstItem.canvasId || firstItem._id;
                    setSelectedItemId(id);
                    handleChange('color', firstItem.color || colors[firstItem.category] || '#F5F5DC');
                  }
                }}
              >
                🪑
                <span>Selected Item</span>
              </button>
            </div>
          </div>

          {/* Item Selector */}
          {settings.target === 'item' && (
            <div className="appearance-card">
              <h2>Select Item to Color</h2>
              <div className="item-selector-grid">
                {canvasItems.map((item) => {
                  const id = item.canvasId || item._id;
                  return (
                    <button
                      key={id}
                      className={`item-select-btn ${selectedItemId === id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedItemId(id);
                        handleChange('color', item.color || colors[item.category] || '#808080');
                      }}
                    >
                      {item.name || item.category}
                    </button>
                  );
                })}
              </div>
              {canvasItems.length === 0 && <p className="no-items-msg">No items in your room yet.</p>}
            </div>
          )}

          {/* Wall Colour */}
          <div className="appearance-card">
            <h2>Wall Colour</h2>
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
              <button className={`shading-btn ${settings.shading === 'flat' ? 'active' : ''}`} onClick={() => handleChange('shading', 'flat')}>
                Flat<span><p>No shading, solid colors</p></span>
              </button>
              <button className={`shading-btn ${settings.shading === 'smooth' ? 'active' : ''}`} onClick={() => handleChange('shading', 'smooth')}>
                Smooth<span><p>Smooth gradient shading</p></span>
              </button>
              <button className={`shading-btn ${settings.shading === 'realistic' ? 'active' : ''}`} onClick={() => handleChange('shading', 'realistic')}>
                Realistic<span><p>Advanced lighting and shadows</p></span>
              </button>
            </div>
          </div>

          <div className="actions">
            <button
              className="apply-btn"
              onClick={handleApply}
              disabled={loading || (settings.target === 'item' && !selectedItemId)}
            >
              {loading ? 'Applying...' : '✓ Save & See in 3D'}
            </button>
          </div>

        </div>
      </div>
      <Footer />
     </div>
    </div>
  );
};

export default Appearance;