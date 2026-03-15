import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import TemplateSelector from './TemplateSelector';
import CompareDesignModal from './CompareDesignModal';
import { getDesign, updateDesign, createDesign } from '../../api/designs';
import { getAllProducts } from '../../api/products';
import './LayoutEditor.css';

const LayoutEditor = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [designId, setDesignId] = useState(null);
  const [roomSpecs, setRoomSpecs] = useState({ length: 5, width: 4, unit: 'meters' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);
  const [itemPosition, setItemPosition] = useState({ x: 1.5, y: 2.0 });
  const [itemSize, setItemSize] = useState({ width: 2.0, height: 1.0 });
  const [rotation, setRotation] = useState(0);
  const [furnitureCategories, setFurnitureCategories] = useState({
    sofas: [], chairs: [], tables: [], beds: [], desks: []
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [roomShape, setRoomShape] = useState('rectangle');
  const [roomDimensions, setRoomDimensions] = useState({ width: 5, length: 4 });
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('sofas');
  const [productsLoading, setProductsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const dragOffset = useRef({ x: 0, y: 0 });

  const historyRef = useRef([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((items) => {
    historyRef.current = historyRef.current.slice(0, historyIndex + 1);
    historyRef.current.push(items);
    setHistoryIndex(historyRef.current.length - 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCanvasItems(historyRef.current[newIndex] || []);
    setSelectedItem(null);
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= historyRef.current.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCanvasItems(historyRef.current[newIndex] || []);
    setSelectedItem(null);
  }, [historyIndex]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const products = data.products || [];
        const categorized = { sofas: [], chairs: [], tables: [], beds: [], desks: [] };
        products.forEach(product => {
          if (categorized[product.category]) {
            categorized[product.category].push({
              id: product._id,
              name: product.name,
              size: `${product.dimensions.length}m x ${product.dimensions.width}m`,
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
      } catch (err) {
        console.error('Failed to load furniture:', err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();

    const specs = localStorage.getItem('roomSpecs');
    if (specs) {
      try {
        const parsed = JSON.parse(specs);
        if (parsed.shape) setRoomShape(parsed.shape);
        if (parsed.width && parsed.length) {
          setRoomDimensions({ width: parsed.width, length: parsed.length });
        }
      } catch (e) {}
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
          const loaded = design.canvasItems || [];
          setCanvasItems(loaded);
          historyRef.current = [loaded];
          setHistoryIndex(0);
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
      console.error('Auto-save failed:', err);
    }
  }, [designId]);

  useEffect(() => {
    if (!designId) return;
    const t = setTimeout(() => saveLayout(canvasItems), 800);
    return () => clearTimeout(t);
  }, [canvasItems, designId, saveLayout]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      let id = designId || localStorage.getItem('currentDesignId');
      if (!id) {
        const savedSpecs = localStorage.getItem('roomSpecs');
        const specs = savedSpecs ? JSON.parse(savedSpecs) : roomSpecs;
        const design = await createDesign(specs, 'My Design');
        id = design._id;
        setDesignId(id);
        localStorage.setItem('currentDesignId', id);
      }
      await updateDesign(id, { canvasItems });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

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
    const newItems = [...canvasItems, newItem];
    setCanvasItems(newItems);
    setSelectedItem(newItem);
    pushHistory(newItems);
  };

  useEffect(() => {
    if (selectedItem) {
      setItemPosition({ x: selectedItem.x ?? 1.5, y: selectedItem.y ?? 2.0 });
      setItemSize({ width: selectedItem.width ?? 2.0, height: selectedItem.height ?? 1.0 });
      setRotation(selectedItem.rotation ?? 0);
    }
  }, [selectedItem?.canvasId]);

  const updateSelectedOnCanvas = (changes) => {
    if (!selectedItem) return;
    const updated = { ...selectedItem, ...changes };
    setSelectedItem(updated);
    setCanvasItems(prev => prev.map(i => i.canvasId === updated.canvasId ? updated : i));
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    updateSelectedOnCanvas({ rotation: newRotation });
  };

  const handleApplyTemplate = (template) => {
    if (!template || !template.furniture) return;

    const templateName = template.name || `template-${Date.now()}`;

    const newItems = template.furniture.map((f, idx) => ({
      canvasId: Date.now() + idx,
      id: f.id,
      name: f.name,
      image: f.image,
      price: f.price,
      discount: f.discount,
      dimensions: f.dimensions,
      category: f.category,
      x: f.x || 0,
      y: f.y || 0,
      width: f.width || 2,
      height: f.height || 1,
      rotation: f.rotation || 0,
      fromTemplate: true
    }));

    const remainingItems = canvasItems.filter(item => !item.fromTemplate);

    setCanvasItems([...remainingItems, ...newItems]);
    setCurrentTemplate(template);
    const remaining = canvasItems.filter(item => !item.fromTemplate);
    const combined = [...remaining, ...newItems];
    setCanvasItems(combined);
    pushHistory(combined);
  };

  const handleDelete = () => {
    if (selectedItem) {
      const newItems = canvasItems.filter(item => item.canvasId !== selectedItem.canvasId);
      setCanvasItems(newItems);
      setSelectedItem(null);
      pushHistory(newItems);
    }
  };

  const handleSelectDesignForComparison = (selectedDesign) => {
    const currentId = designId || localStorage.getItem('currentDesignId');
    if (currentId) {
      setShowCompareModal(false);
      navigate('/design-comparison', {
        state: {
          designA: currentId,
          designB: selectedDesign._id
        }
      });
    }
  };
  const totalCost = canvasItems.reduce((sum, i) => {
    if (!i.price) return sum;
    return sum + (i.discount > 0 ? i.price - (i.price * i.discount / 100) : i.price);
  }, 0);

  const PriceList = () => (
    <div className="canvas-price-list">
      {canvasItems.filter(i => i.price).map((i, idx) => (
        <div key={i.canvasId || idx} className="canvas-price-row">
          <span className="canvas-price-name">{i.name}</span>
          <span className="canvas-price-val">
            {i.discount > 0 ? (
              <><span className="canvas-price-orig">Rs. {i.price.toLocaleString()}</span>
              <span className="canvas-price-disc">Rs. {Math.round(i.price - i.price * i.discount / 100).toLocaleString()}</span></>
            ) : <span>Rs. {i.price.toLocaleString()}</span>}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar userRole={userRole} />
      <div className="layout-editor">
        <header className="editor-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>Back</button>
          <h1>2D Layout Editor</h1>
          <div className="header-actions">
            <button
              className="toolbar-btn compare-btn"
              onClick={() => setShowCompareModal(true)}
              title="Compare with previous designs"
            >
              🔍 Compare Design
            </button>
            
            <button className={"save-btn " + saveStatus} onClick={handleSave} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved!'}
              {saveStatus === 'error' && 'Failed'}
              {saveStatus === 'idle' && 'Save Design'}
            </button>
            <button className="view-3d-btn" onClick={async () => {
              let id = designId || localStorage.getItem('currentDesignId');
              localStorage.setItem('canvasItems', JSON.stringify(canvasItems));
              if (!id) {
                const savedSpecs = localStorage.getItem('roomSpecs');
                if (savedSpecs) {
                  try {
                    const design = await createDesign(JSON.parse(savedSpecs));
                    id = design._id;
                    await updateDesign(id, { canvasItems });
                    localStorage.setItem('currentDesignId', id);
                  } catch (e) { console.error(e); }
                }
              }
              if (id) localStorage.setItem('currentDesignId', id);
              navigate('/room-3d');
            }}>
              👁️View in 3D
            </button>
          </div>
        </header>

        <div className="editor-container">
          <aside className="furniture-sidebar">
            <h3>Furniture Items</h3>
            <p className="sidebar-subtitle">Click to add to canvas</p>
            {productsLoading ? (
              <div className="sidebar-loading">Loading furniture...</div>
            ) : (
              <div className="furniture-categories">
                {Object.entries(furnitureCategories).map(([category, items]) => (
                  <div key={category} className="category-section">
                    <button
                      className={"category-header " + (expandedCategory === category ? 'active' : '')}
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                    >
                      <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <span className="expand-icon">{expandedCategory === category ? 'v' : '>'}</span>
                    </button>
                    {expandedCategory === category && (
                      <div className="furniture-items">
                        {items.length > 0 ? items.map(item => (
                          <div key={item.id} className="furniture-item" onClick={() => handleAddToCanvas(item)}>
                            <div className="item-icon">
                              {item.image && (item.image.startsWith('data:image') || item.image.startsWith('http'))
                                ? <img src={item.image} alt={item.name} className="item-thumbnail" />
                                : <span>chair</span>}
                            </div>
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p className="item-size">{item.size}</p>
                              <span className="item-badge">{item.type}</span>
                              {item.price && (
                                <p className="item-price">
                                  {item.discount > 0
                                    ? <><span className="discounted">Rs. {(item.price - item.price * item.discount / 100).toLocaleString()}</span><span className="original">Rs. {item.price.toLocaleString()}</span></>
                                    : <span>Rs. {item.price.toLocaleString()}</span>}
                                </p>
                              )}
                            </div>
                          </div>
                        )) : <p className="no-items">No items</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main className="canvas-area">
            <div className="canvas-toolbar">
              <div className="toolbar-left">
                <button className="toolbar-btn" onClick={handleUndo} disabled={historyIndex <= 0}>Undo</button>
                <button className="toolbar-btn" onClick={handleRedo} disabled={historyIndex >= historyRef.current.length - 1}>Redo</button>
                <button className="toolbar-btn" onClick={() => {
                  if (window.confirm('Reset layout?')) {
                    setCanvasItems([]);
                    setSelectedItem(null);
                    pushHistory([]);
                  }
                }}>Reset</button>
                <button className="toolbar-btn" onClick={() => setShowTemplateSelector(true)}>Explore Templates</button>
              </div>
              <div className="toolbar-right">
                <div className="furniture-count">
                  <span className="count-text">Items: {canvasItems.length}</span>
                </div>
                {canvasItems.some(i => i.price) && (
                  <div className="furniture-count cost-summary">
                    <span className="count-text">Total: Rs. {totalCost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="canvas-wrapper">
              <div className="room-label">Room: {roomDimensions.length}m x {roomDimensions.width}m</div>
              <div className="canvas-grid" style={{ width: roomDimensions.length * 50 + 'px', height: roomDimensions.width * 50 + 'px' }}>
                <svg className="room-svg" viewBox={"0 0 " + roomDimensions.length * 50 + " " + roomDimensions.width * 50} preserveAspectRatio="none">
                  {(roomShape === 'rectangle' || roomShape === 'square') && (
                    <rect x="0" y="0" width={roomDimensions.length * 50} height={roomDimensions.width * 50} fill="#f5f5dc" stroke="#333" strokeWidth="3" />
                  )}
                  {roomShape === 'l-shape' && (
                    <path d={"M0 0 L" + roomDimensions.length * 50 + " 0 L" + roomDimensions.length * 50 + " " + roomDimensions.width * 25 + " L" + roomDimensions.length * 25 + " " + roomDimensions.width * 25 + " L" + roomDimensions.length * 25 + " " + roomDimensions.width * 50 + " L0 " + roomDimensions.width * 50 + " Z"} fill="#f5f5dc" stroke="#333" strokeWidth="3" />
                  )}
                  {roomShape === 'u-shape' && (
                    <path d={"M0 0 L" + roomDimensions.length * 50 + " 0 L" + roomDimensions.length * 50 + " " + roomDimensions.width * 50 + " L" + roomDimensions.length * 40 + " " + roomDimensions.width * 50 + " L" + roomDimensions.length * 40 + " " + roomDimensions.width * 20 + " L" + roomDimensions.length * 10 + " " + roomDimensions.width * 20 + " L" + roomDimensions.length * 10 + " " + roomDimensions.width * 50 + " L0 " + roomDimensions.width * 50 + " Z"} fill="#f5f5dc" stroke="#333" strokeWidth="3" />
                  )}
                </svg>
                {canvasItems.map(item => (
                  <div
                    key={item.canvasId}
                    className={"canvas-item " + (selectedItem && selectedItem.canvasId === item.canvasId ? 'selected' : '')}
                    style={{ left: item.x * 50 + 'px', top: item.y * 50 + 'px', width: item.width * 50 + 'px', height: item.height * 50 + 'px', transform: 'rotate(' + item.rotation + 'deg)' }}
                    onClick={() => setSelectedItem(item)}
                    draggable
                    onDragStart={(e) => { 
                      e.dataTransfer.effectAllowed = 'move'; 
                      e.dataTransfer.setData('canvasId', item.canvasId.toString());
                      
                      const rect = e.currentTarget.getBoundingClientRect();
                      // Store the offset of the click from the top-left corner of the item (in meters)
                      dragOffset.current = {
                        x: (e.clientX - rect.left) / 50,
                        y: (e.clientY - rect.top) / 50
                      };
                    }}
                    onDragEnd={(e) => {
                      const canvas = e.currentTarget.parentElement;
                      const rect = canvas.getBoundingClientRect();
                      
                      // Final position (meters) = (MousePos - CanvasPos) / 50 - OffsetWithinItem
                      const rawX = (e.clientX - rect.left) / 50 - dragOffset.current.x;
                      const rawY = (e.clientY - rect.top) / 50 - dragOffset.current.y;
                      
                      const newX = Math.max(0, Math.min(roomDimensions.length - item.width, rawX));
                      const newY = Math.max(0, Math.min(roomDimensions.width - item.height, rawY));
                      
                      const newItems = canvasItems.map(i =>
                        i.canvasId === item.canvasId
                          ? { ...i, x: newX, y: newY }
                          : i
                      );
                      setCanvasItems(newItems);
                      pushHistory(newItems);
                      if (selectedItem && selectedItem.canvasId === item.canvasId) {
                        setSelectedItem({ ...item, x: newX, y: newY });
                      }
                    }}
                  >
                    {item.image && (item.image.startsWith('data:image') || item.image.startsWith('http'))
                      ? <img src={item.image} alt={item.name} className="canvas-item-image" />
                      : <span className="canvas-item-emoji">chair</span>}
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

          <aside className="properties-sidebar">
            <h3>Item Properties</h3>
            {selectedItem ? (
              <div>
                <div className="property-section selected-item-info">
                  <div className="selected-item-header">
                    <div className="selected-item-icon">
                      {selectedItem.image && (selectedItem.image.startsWith('data:image') || selectedItem.image.startsWith('http'))
                        ? <img src={selectedItem.image} alt={selectedItem.name} className="selected-thumbnail" />
                        : <span className="selected-emoji">chair</span>}
                    </div>
                    <div className="selected-item-details">
                      <h4>{selectedItem.name}</h4>
                      <p className="item-category-badge">{selectedItem.type || 'Furniture'}</p>
                    </div>
                  </div>
                  {selectedItem.dimensions && (
                    <div className="item-dimensions-display">
                      <span>{selectedItem.dimensions.length}m x {selectedItem.dimensions.width}m x {selectedItem.dimensions.height}m</span>
                    </div>
                  )}
                  {selectedItem.price && (
                    <div className="item-price-display">
                      <span>Rs. {selectedItem.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="property-section">
                  <h4>Position</h4>
                  <div className="input-row">
                    <div className="input-group">
                      <label>X (m)</label>
                      <input type="number" value={itemPosition.x} step="0.1" onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setItemPosition(p => ({ ...p, x: val }));
                        updateSelectedOnCanvas({ x: val });
                      }} />
                    </div>
                    <div className="input-group">
                      <label>Y (m)</label>
                      <input type="number" value={itemPosition.y} step="0.1" onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setItemPosition(p => ({ ...p, y: val }));
                        updateSelectedOnCanvas({ y: val });
                      }} />
                    </div>
                  </div>
                </div>

                <div className="property-section">
                  <h4>Size</h4>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Width (m)</label>
                      <input type="number" value={itemSize.width} step="0.1" min="0.5" onChange={(e) => {
                        const val = Math.max(0.5, parseFloat(e.target.value) || 0.5);
                        setItemSize(s => ({ ...s, width: val }));
                        updateSelectedOnCanvas({ width: val });
                      }} />
                    </div>
                    <div className="input-group">
                      <label>Height (m)</label>
                      <input type="number" value={itemSize.height} step="0.1" min="0.5" onChange={(e) => {
                        const val = Math.max(0.5, parseFloat(e.target.value) || 0.5);
                        setItemSize(s => ({ ...s, height: val }));
                        updateSelectedOnCanvas({ height: val });
                      }} />
                    </div>
                  </div>
                </div>

                <div className="property-section">
                  <h4>Rotation: {rotation} deg</h4>
                </div>

                <div className="property-actions">
                  <button className="action-btn rotate-btn" onClick={handleRotate}>Rotate 90</button>
                  <button className="action-btn delete-btn" onClick={handleDelete}>Delete Item</button>
                </div>

                <div className="property-section status">
                  <h4>Room Statistics</h4>
                  <div className="stat-item"><span className="stat-label">Total Furniture:</span><span className="stat-value">{canvasItems.length}</span></div>
                  <div className="stat-item"><span className="stat-label">Room Size:</span><span className="stat-value">{roomDimensions.length}m x {roomDimensions.width}m</span></div>
                  {canvasItems.some(i => i.price) && (
                    <div>
                      <div className="stat-item stat-total"><span className="stat-label">Total Cost:</span><span className="stat-value stat-price">Rs. {totalCost.toLocaleString()}</span></div>
                      <PriceList />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="no-selection">Select an item to view properties</p>
                <div className="property-section status">
                  <h4>Room Statistics</h4>
                  <div className="stat-item"><span className="stat-label">Total Furniture:</span><span className="stat-value">{canvasItems.length}</span></div>
                  <div className="stat-item"><span className="stat-label">Room Size:</span><span className="stat-value">{roomSpecs.length || 5}{roomSpecs.unit === 'feet' ? 'ft' : 'm'} x {roomSpecs.width || 4}{roomSpecs.unit === 'feet' ? 'ft' : 'm'}</span></div>
                  {canvasItems.some(i => i.price) && (
                    <div>
                      <div className="stat-item stat-total"><span className="stat-label">Total Cost:</span><span className="stat-value stat-price">Rs. {totalCost.toLocaleString()}</span></div>
                      <PriceList />
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {showTemplateSelector && (
          <TemplateSelector
            onApplyTemplate={handleApplyTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
          
        )}
        <CompareDesignModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          currentDesignId={designId || localStorage.getItem('currentDesignId')}
          userId={localStorage.getItem('userEmail')}
          onSelectDesign={handleSelectDesignForComparison}
        />
      </div>
    </>
  );
};

export default LayoutEditor;
