import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import './LayoutEditor.css';

const LayoutEditor = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Load products from localStorage (added by admin)
    const savedProducts = localStorage.getItem('furnitureProducts');
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      
      // Group products by category
      const categorized = {
        sofas: [],
        chairs: [],
        tables: [],
        beds: [],
        desks: []
      };

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
            discount: product.discount
          });
        }
      });

      setFurnitureCategories(categorized);
    }
  }, []);

  const [expandedCategory, setExpandedCategory] = useState('sofas');

  const handleAddToCanvas = (item) => {
    const newItem = {
      ...item,
      canvasId: Date.now(),
      x: 1.5,
      y: 2.0,
      width: item.dimensions ? parseFloat(item.dimensions.length) : 2.0,
      height: item.dimensions ? parseFloat(item.dimensions.width) : 1.0,
      rotation: 0
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

  const handleDelete = () => {
    if (selectedItem) {
      setCanvasItems(canvasItems.filter(item => item.canvasId !== selectedItem.canvasId));
      setSelectedItem(null);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="layout-editor with-sidebar">
      <header className="editor-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>2D Layout Editor</h1>
        <button
          className="view-3d-btn"
          onClick={() => navigate('/room-3d')}
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
            <button className="toolbar-btn">↶ Undo</button>
            <button className="toolbar-btn">↷ Redo</button>
            <button className="toolbar-btn">Reset Layout</button>
            <button className="toolbar-btn snap-btn">⊞ Snap to Grid</button>
          </div>

          <div className="canvas-wrapper">
            <div className="room-label">Room: 5m × 4m</div>
            <div className="canvas-grid">
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
                >
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
            <>
              <div className="property-section">
                <h4>{selectedItem.name}</h4>
                <p className="currently-selected">Currently selected</p>
              </div>

              <div className="property-section">
                <h4>Position</h4>
                <div className="input-row">
                  <div className="input-group">
                    <label>X (m)</label>
                    <input
                      type="number"
                      value={itemPosition.x}
                      onChange={(e) => setItemPosition({ ...itemPosition, x: e.target.value })}
                      step="0.1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Y (m)</label>
                    <input
                      type="number"
                      value={itemPosition.y}
                      onChange={(e) => setItemPosition({ ...itemPosition, y: e.target.value })}
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div className="property-section">
                <h4>Size</h4>
                <div className="input-row">
                  <div className="input-group">
                    <label>Width (m)</label>
                    <input
                      type="number"
                      value={itemSize.width}
                      onChange={(e) => setItemSize({ ...itemSize, width: e.target.value })}
                      step="0.1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Height (m)</label>
                    <input
                      type="number"
                      value={itemSize.height}
                      onChange={(e) => setItemSize({ ...itemSize, height: e.target.value })}
                      step="0.1"
                    />
                  </div>
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
                <h4>Status</h4>
                <p>Total items: {canvasItems.length}</p>
                <p>Grid: On</p>
              </div>
            </>
          ) : (
            <p className="no-selection">Select an item to view properties</p>
          )}
        </aside>
      </div>
    </div>
    </>
  );
};

export default LayoutEditor;
