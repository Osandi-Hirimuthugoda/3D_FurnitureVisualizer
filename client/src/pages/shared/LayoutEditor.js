import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import Sidebar from '../../components/admin/Sidebar';
import { getDesign, updateDesign, createDesign } from '../../api/designs';
=======
import Navbar from '../../components/shared/Navbar';
import TemplateSelector from './TemplateSelector';
>>>>>>> 21c49e73f8d401c86cd6b088e648e9c854f5f98f
import './LayoutEditor.css';

const LayoutEditor = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [designId, setDesignId] = useState(null);
  const [roomSpecs, setRoomSpecs] = useState({ length: 5, width: 4, unit: 'meters' });
=======
  const userRole = localStorage.getItem('userRole');
>>>>>>> 21c49e73f8d401c86cd6b088e648e9c854f5f98f
  const [selectedItem, setSelectedItem] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);
  const [itemPosition, setItemPosition] = useState({ x: 1.5, y: 2.0 });
  const [itemSize, setItemSize] = useState({ width: 2.0, height: 1.0 });
  const [rotation, setRotation] = useState(0);
  const [furnitureCategories, setFurnitureCategories] = useState({
    sofas: [],
    chairs: [],
    tables: [],
    beds: [],
    desks: []
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [roomShape, setRoomShape] = useState('rectangle');
  const [roomDimensions, setRoomDimensions] = useState({ width: 5, length: 4 });

  useEffect(() => {
    const savedProducts = localStorage.getItem('furnitureProducts');
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      const categorized = { sofas: [], chairs: [], tables: [], beds: [], desks: [] };
      products.forEach(product => {
        if (categorized[product.category]) {
          categorized[product.category].push({
            id: product._id,
            name: product.name,
            size: `${product.dimensions.length}m × ${product.dimensions.width}m`,
            type: product.inStock ? 'Available' : 'Out of Stock',
            image: product.image,
            dimensions: product.dimensions,
            price: product.price,
            discount: product.discount,
            category: product.category
          });
        }
      });
      setFurnitureCategories(categorized);
    }

    // read room shape from specs
    const specs = localStorage.getItem('roomSpecs');
    if (specs) {
      try {
        const parsed = JSON.parse(specs);
        if (parsed.shape) setRoomShape(parsed.shape);
        if (parsed.width && parsed.length) {
          setRoomDimensions({ width: parsed.width, length: parsed.length });
        }
      } catch (e) {
        console.warn('failed to parse roomSpecs', e);
      }
    }
  }, []);

  useEffect(() => {
    const loadDesign = async () => {
      const id = localStorage.getItem('currentDesignId');
      const savedSpecs = localStorage.getItem('roomSpecs');
      if (id) {
        try {
          const design = await getDesign(id);
          setDesignId(design._id);
          setRoomSpecs(design.roomSpecs || {});
          setCanvasItems(design.canvasItems || []);
        } catch {
          setDesignId(null);
          if (savedSpecs) setRoomSpecs(JSON.parse(savedSpecs));
        }
      } else if (savedSpecs) {
        setRoomSpecs(JSON.parse(savedSpecs));
      }
    };
    loadDesign();
  }, []);

  const saveLayout = useCallback(async (items) => {
    const id = designId || localStorage.getItem('currentDesignId');
    if (!id) return;
    try {
      await updateDesign(id, { canvasItems: items });
    } catch (err) {
      console.error('Failed to save layout:', err);
    }
  }, [designId]);

  useEffect(() => {
    if (!designId) return;
    const t = setTimeout(() => saveLayout(canvasItems), 800);
    return () => clearTimeout(t);
  }, [canvasItems, designId, saveLayout]);

  const [expandedCategory, setExpandedCategory] = useState('sofas');

  const handleAddToCanvas = (item) => {
    const newItem = {
      ...item,
      canvasId: Date.now(),
      x: 1.5,
      y: 2.0,
      width: item.dimensions ? parseFloat(item.dimensions.length) : 2.0,
      height: item.dimensions ? parseFloat(item.dimensions.width) : 1.0,
      rotation: 0,
      category: item.category || 'sofas'
    };
    setCanvasItems([...canvasItems, newItem]);
    setSelectedItem(newItem);
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    if (selectedItem) {
      setCanvasItems(canvasItems.map(item =>
        item.canvasId === selectedItem.canvasId
          ? { ...item, rotation: newRotation }
          : item
      ));
    }
  };

  const handleApplyTemplate = (template) => {
    if (!template || !template.furniture) return;

    const getFurnitureEmoji = (type) => {
      const t = type.toLowerCase();

      if (t.includes('sofa')) return '🛋️';
      if (t.includes('chair')) return '🪑';
      if (t.includes('table')) return '⛩️';
      if (t.includes('wardrobe')) return '🚪';
      if (t.includes('bed')) return '🛏️';
      if (t.includes('desk')) return '🖥️';
      if (t.includes('lamp')) return '💡';
      if (t.includes('cabinet')) return '🗄️';
      if (t.includes('nightstand')) return '🗄️';
      if (t.includes('bookshelf')) return '📚';

      return '🪑';
    };

    const newItems = template.furniture.map((f, idx) => {
      const x = f.position && f.position.length >= 1 ? f.position[0] : 0;
      const y = f.position && f.position.length >= 3
        ? f.position[2]
        : (f.position && f.position.length >= 2 ? f.position[1] : 0);

      const formattedName = f.type.replace(/([A-Z])/g, ' $1');

      return {
        canvasId: Date.now() + idx,
        name: formattedName,
        x,
        y,

        // slightly larger size so text fits
        width: Math.max(2.2, formattedName.length * 0.15),
        height: 1.4,

        rotation: f.rotation || 0,
        image: getFurnitureEmoji(f.type), //correct emoji
        fromTemplate: true
      };
    });

    const remainingItems = canvasItems.filter(item => !item.fromTemplate);

    setCanvasItems([...remainingItems, ...newItems]);
  };

  const handleDelete = () => {
    if (selectedItem) {
      setCanvasItems(canvasItems.filter(item => item.canvasId !== selectedItem.canvasId));
      setSelectedItem(null);
    }
  };

  return (
    <>
      <Navbar userRole={userRole} />
      <div className="layout-editor">
      <header className="editor-header">
        <button className="back-btn" onClick={() => navigate('/room-setup')}>
          ← Back
        </button>
        <h1>2D Layout Editor</h1>
        <button
          className="view-3d-btn"
          onClick={async () => {
            let id = designId || localStorage.getItem('currentDesignId');
            if (!id) {
              const savedSpecs = localStorage.getItem('roomSpecs');
              if (savedSpecs) {
                try {
                  const design = await createDesign(JSON.parse(savedSpecs));
                  id = design._id;
                  await updateDesign(id, { canvasItems });
                  localStorage.setItem('currentDesignId', id);
                } catch (e) {
                  console.error(e);
                }
              }
            }
            if (id) localStorage.setItem('currentDesignId', id);
            navigate('/room-3d');
          }}
        >
          👁️ View in 3D
        </button>
      </header>

      <div className="editor-container">
        {/* Left Sidebar - Furniture Items */}
        <aside className="furniture-sidebar">
          <h3>Furniture Items</h3>
          <p className="sidebar-subtitle">Click to add to canvas</p>

          <div className="furniture-categories">
            {Object.entries(furnitureCategories).map(([category, items]) => (
              <div key={category} className="category-section">
                <button
                  className={`category-header ${expandedCategory === category ? 'active' : ''}`}
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                >
                  <span className="category-icon">
                    {category === 'sofas' && '🛋️'}
                    {category === 'chairs' && '🪑'}
                    {category === 'tables' && '🪑'}
                    {category === 'beds' && '🛏️'}
                    {category === 'desks' && '🖥️'}
                  </span>
                  <span className="category-name">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="expand-icon">{expandedCategory === category ? '▼' : '▶'}</span>
                </button>

                {expandedCategory === category && (
                  <div className="furniture-items">
                    {items.length > 0 ? (
                      items.map(item => (
                        <div
                          key={item.id}
                          className="furniture-item"
                          onClick={() => handleAddToCanvas(item)}
                        >
                          <div className="item-icon">
                            {item.image ? (
                              item.image.startsWith('data:image') || item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.name} className="item-thumbnail" />
                              ) : (
                                <span>{item.image}</span>
                              )
                            ) : (
                              <span>🪑</span>
                            )}
                          </div>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p className="item-size">{item.size}</p>
                            <span className="item-badge">{item.type}</span>
                            {item.price && (
                              <p className="item-price">
                                {item.discount > 0 ? (
                                  <>
                                    <span className="discounted">Rs. {(item.price - (item.price * item.discount / 100)).toLocaleString()}</span>
                                    <span className="original">Rs. {item.price.toLocaleString()}</span>
                                  </>
                                ) : (
                                  <span>Rs. {item.price.toLocaleString()}</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items">No items in this category</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="canvas-area">
          <div className="canvas-toolbar">
            <div className="toolbar-left">
              <button className="toolbar-btn">↶ Undo</button>
              <button className="toolbar-btn">↷ Redo</button>
              <button className="toolbar-btn" onClick={() => {
                if (window.confirm('Are you sure you want to reset the layout?')) {
                  setCanvasItems([]);
                  setSelectedItem(null);
                }
              }}>Reset Layout</button>
              <button className="toolbar-btn snap-btn">⊞ Snap to Grid</button>
              <button
                className="toolbar-btn"
                onClick={() => setShowTemplateSelector(true)}
              >
                🧩 Explore Templates
              </button>
            </div>
            <div className="toolbar-right">
              <div className="furniture-count">
                <span className="count-icon">🪑</span>
                <span className="count-text">Total Furniture: {canvasItems.length}</span>
              </div>
            </div>
          </div>

          <div className="canvas-wrapper">
            <div className="room-label">
<<<<<<< HEAD
              Room: {roomSpecs.length || 5}{roomSpecs.unit === 'feet' ? 'ft' : 'm'} × {roomSpecs.width || 4}{roomSpecs.unit === 'feet' ? 'ft' : 'm'}
            </div>
=======
              Room: {roomDimensions.length}m × {roomDimensions.width}m
            </div>

>>>>>>> 21c49e73f8d401c86cd6b088e648e9c854f5f98f
            <div className="canvas-grid">
              <svg
                className="room-svg"
                viewBox="0 0 500 400"
                preserveAspectRatio="none"
              >
                {roomShape === 'rectangle' && (
                  <rect x="0" y="0" width="500" height="400" fill="#f5f5dc" stroke="#333" strokeWidth="3"/>
                )}

                {roomShape === 'square' && (
                  <rect x="50" y="0" width="400" height="400" fill="#f5f5dc" stroke="#333" strokeWidth="3"/>
                )}

                {roomShape === 'l-shape' && (
                  <path
                    d="M0 0 L500 0 L500 200 L250 200 L250 400 L0 400 Z"
                    fill="#f5f5dc"
                    stroke="#333"
                    strokeWidth="3"
                  />
                )}

                {roomShape === 'u-shape' && (
                  <path
                    d="M0 0 L500 0 L500 400 L400 400 L400 160 L100 160 L100 400 L0 400 Z"
                    fill="#f5f5dc"
                    stroke="#333"
                    strokeWidth="3"
                  />
                )}
              </svg>
              {canvasItems.map(item => (
                <div
                  key={item.canvasId}
                  className={`canvas-item ${selectedItem?.canvasId === item.canvasId ? 'selected' : ''}`}
                  style={{
                    left: `${item.x * 50}px`,
                    top: `${item.y * 50}px`,
                    width: `${item.width * 50}px`,
                    height: `${item.height * 50}px`,
                    transform: `rotate(${item.rotation}deg)`
                  }}
                  onClick={() => setSelectedItem(item)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('canvasId', item.canvasId.toString());
                  }}
                  onDragEnd={(e) => {
                    const canvas = e.currentTarget.parentElement;
                    const rect = canvas.getBoundingClientRect();
                    const newX = (e.clientX - rect.left) / 50;
                    const newY = (e.clientY - rect.top) / 50;
                    
                    setCanvasItems(canvasItems.map(i =>
                      i.canvasId === item.canvasId
                        ? { ...i, x: Math.max(0, Math.min(10 - i.width, newX)), y: Math.max(0, Math.min(8 - i.height, newY)) }
                        : i
                    ));
                    if (selectedItem?.canvasId === item.canvasId) {
                      setSelectedItem({ ...item, x: newX, y: newY });
                    }
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
                  <div className="resize-handles">
                    <div className="handle top-left"></div>
                    <div className="handle top-right"></div>
                    <div className="handle bottom-left"></div>
                    <div className="handle bottom-right"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="properties-sidebar">
          <h3>Item Properties</h3>
          
          {selectedItem ? (
              <><div className="property-section selected-item-info">
                <div className="selected-item-header">
                  <div className="selected-item-icon">
                    {selectedItem.image ? (
                      selectedItem.image.startsWith('data:image') || selectedItem.image.startsWith('http') ? (
                        <img src={selectedItem.image} alt={selectedItem.name} className="selected-thumbnail" />
                      ) : (
                        <span className="selected-emoji">{selectedItem.image}</span>
                      )
                    ) : (
                      <span className="selected-emoji">🪑</span>
                    )}
                  </div>
                  <div className="selected-item-details">
                    <h4>{selectedItem.name}</h4>
                    <p className="item-category-badge">{selectedItem.type || 'Furniture'}</p>
                  </div>
                </div>
                <div className="selected-status">
                  <span className="status-indicator"></span>
                  <span className="status-text">Currently selected</span>
                </div>
                {selectedItem.dimensions && (
                  <div className="item-dimensions-display">
                    <span className="dimension-icon">📏</span>
                    <span className="dimension-text">
                      {selectedItem.dimensions.length}m × {selectedItem.dimensions.width}m × {selectedItem.dimensions.height}m
                    </span>
                  </div>
                )}
                {selectedItem.price && (
                  <div className="item-price-display">
                    <span className="price-icon">💰</span>
                    <span className="price-text">Rs. {selectedItem.price.toLocaleString()}</span>
                  </div>
                )}
              </div><div className="property-section">
                  <h4>Position</h4>
                  <div className="input-row">
                    <div className="input-group">
                      <label>X (m)</label>
                      <input
                        type="number"
                        value={itemPosition.x}
                        onChange={(e) => setItemPosition({ ...itemPosition, x: e.target.value })}
                        step="0.1" />
                    </div>
                    <div className="input-group">
                      <label>Y (m)</label>
                      <input
                        type="number"
                        value={itemPosition.y}
                        onChange={(e) => setItemPosition({ ...itemPosition, y: e.target.value })}
                        step="0.1" />
                    </div>
                  </div>
                </div><div className="property-section">
                  <h4>Size</h4>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Width (m)</label>
                      <input
                        type="number"
                        value={itemSize.width}
                        onChange={(e) => setItemSize({ ...itemSize, width: e.target.value })}
                        step="0.1" />
                    </div>
                    <div className="input-group">
                      <label>Height (m)</label>
                      <input
                        type="number"
                        value={itemSize.height}
                        onChange={(e) => setItemSize({ ...itemSize, height: e.target.value })}
                        step="0.1" />
                    </div>
                  </div>
                </div><div className="property-section">
                  <h4>Rotation: {rotation}°</h4>
                </div><div className="property-actions">
                  <button className="action-btn rotate-btn" onClick={handleRotate}>
                    🔄 Rotate 90°
                  </button>
                  <button className="action-btn delete-btn" onClick={handleDelete}>
                    🗑️ Delete Item
                  </button>
                </div><div className="property-section status">
                  <h4>Room Statistics</h4>
                  <div className="stat-item">
                    <span className="stat-icon">🪑</span>
                    <span className="stat-label">Total Furniture:</span>
                    <span className="stat-value">{canvasItems.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📐</span>
                    <span className="stat-label">Grid:</span>
                    <span className="stat-value">On</span>
                  </div>
<<<<<<< HEAD
                </div>
              </div>

              <div className="property-section">
                <h4>Rotation: {rotation}°</h4>
              </div>

              <div className="property-actions">
                <button className="action-btn rotate-btn" onClick={handleRotate}>
                  🔄 Rotate 90°
                </button>
                <button className="action-btn delete-btn" onClick={handleDelete}>
                  🗑️ Delete Item
                </button>
              </div>

              <div className="property-section status">
                <h4>Room Statistics</h4>
                <div className="stat-item">
                  <span className="stat-icon">🪑</span>
                  <span className="stat-label">Total Furniture:</span>
                  <span className="stat-value">{canvasItems.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📐</span>
                  <span className="stat-label">Grid:</span>
                  <span className="stat-value">On</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🏠</span>
                  <span className="stat-label">Room Size:</span>
                  <span className="stat-value">{roomSpecs.length || 5}{roomSpecs.unit === 'feet' ? 'ft' : 'm'} × {roomSpecs.width || 4}{roomSpecs.unit === 'feet' ? 'ft' : 'm'}</span>
                </div>
              </div>
            </>
=======
                  <div className="stat-item">
                    <span className="stat-icon">🏠</span>
                    <span className="stat-label">Room Size:</span>
                    <span className="stat-value">5m × 4m</span>
                  </div>
                </div></>
>>>>>>> 21c49e73f8d401c86cd6b088e648e9c854f5f98f
          ) : (
            <>
              <p className="no-selection">Select an item to view properties</p>
              
              <div className="property-section status">
                <h4>Room Statistics</h4>
                <div className="stat-item">
                  <span className="stat-icon">🪑</span>
                  <span className="stat-label">Total Furniture:</span>
                  <span className="stat-value">{canvasItems.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📐</span>
                  <span className="stat-label">Grid:</span>
                  <span className="stat-value">On</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🏠</span>
                  <span className="stat-label">Room Size:</span>
                  <span className="stat-value">{roomSpecs.length || 5}{roomSpecs.unit === 'feet' ? 'ft' : 'm'} × {roomSpecs.width || 4}{roomSpecs.unit === 'feet' ? 'ft' : 'm'}</span>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
      {showTemplateSelector && (
        <TemplateSelector
          roomShape={roomShape}
          onApplyTemplate={handleApplyTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
    </>
  );
};

export default LayoutEditor;
