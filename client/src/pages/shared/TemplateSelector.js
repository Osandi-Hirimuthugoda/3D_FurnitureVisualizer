import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../api/products';
import livingroom from '../../assets/templates/livingroom.jpg';
import bed from '../../assets/templates/bed.jpg';
import office from '../../assets/templates/office.jpeg';
import apartment from '../../assets/templates/apartment.jpg';
import './TemplateSelector.css';

const ROOM_TEMPLATES = [
  {
    id: 'living-room',
    name: 'Living Room',
    icon: '🛋️',
    image: livingroom,
    slots: [
      { category: 'sofas',  x: 1,   y: 1,   xStep: 0, yStep: 2.5 },
      { category: 'tables', x: 4.5, y: 2,   xStep: 0, yStep: 2   },
      { category: 'chairs', x: 6.5, y: 1,   xStep: 0, yStep: 2   },
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: '🛏️',
    image: bed,
    slots: [
      { category: 'beds',   x: 1,   y: 0.5, xStep: 0, yStep: 3   },
      { category: 'desks',  x: 5,   y: 0.5, xStep: 0, yStep: 2   },
      { category: 'chairs', x: 5,   y: 3,   xStep: 0, yStep: 2   },
    ]
  },
  {
    id: 'office',
    name: 'Office',
    icon: '🖥️',
    image: office,
    slots: [
      { category: 'desks',  x: 1,   y: 0.5, xStep: 3, yStep: 0   },
      { category: 'chairs', x: 1,   y: 3,   xStep: 3, yStep: 0   },
      { category: 'tables', x: 6,   y: 1,   xStep: 0, yStep: 2   },
    ]
  },
  {
    id: 'studio',
    name: 'Studio Apartment',
    icon: '🏠',
    image: apartment,
    slots: [
      { category: 'beds',   x: 0.5, y: 0.5, xStep: 0, yStep: 3   },
      { category: 'sofas',  x: 5,   y: 0.5, xStep: 0, yStep: 3   },
      { category: 'tables', x: 5,   y: 4,   xStep: 0, yStep: 2   },
    ]
  }
];

const getCategoryIcon = (cat) => {
  const icons = { sofas: '🛋️', chairs: '🪑', tables: '🪑', beds: '🛏️', desks: '🖥️' };
  return icons[cat] || '🪑';
};

const TemplateSelector = ({ onApplyTemplate, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const build = async () => {
      try {
        const data = await getAllProducts();
        const products = data.products || [];
        const byCategory = {};
        products.forEach(p => {
          if (!byCategory[p.category]) byCategory[p.category] = [];
          byCategory[p.category].push(p);
        });

        const built = ROOM_TEMPLATES.map(tmpl => {
          const furniture = [];
          tmpl.slots.forEach((slot, si) => {
            const available = byCategory[slot.category] || [];
            available.forEach((product, pi) => {
              furniture.push({
                id: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                discount: product.discount,
                dimensions: product.dimensions,
                category: product.category,
                x: slot.x + slot.xStep * pi,
                y: slot.y + slot.yStep * pi,
                width: product.dimensions ? parseFloat(product.dimensions.length) || 2 : 2,
                height: product.dimensions ? parseFloat(product.dimensions.width) || 1 : 1,
                rotation: 0
              });
            });
          });
          return { ...tmpl, furniture, count: furniture.length };
        });

        setTemplates(built);
      } catch (err) {
        console.error('Failed to load templates:', err);
        setTemplates(ROOM_TEMPLATES.map(t => ({ ...t, furniture: [], count: 0 })));
      } finally {
        setLoading(false);
      }
    };
    build();
  }, []);

  const handleApply = () => {
    if (!selected) return;
    onApplyTemplate(selected);
    onClose();
  };

  return (
    <div className="ts-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">

        {/* Header */}
        <div className="ts-header">
          <div className="ts-header-left">
            <span className="ts-header-icon">🧩</span>
            <div>
              <h2>Explore Templates</h2>
              <p>Choose a room layout built from your furniture collection</p>
            </div>
          </div>
          <button className="ts-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Body */}
        <div className="ts-body">
          {loading ? (
            <div className="ts-loading">
              <div className="ts-spinner" />
              <p>Building templates from your products...</p>
            </div>
          ) : (
            <div className="ts-grid">
              {templates.map(tmpl => (
                <div
                  key={tmpl.id}
                  className={`ts-card ${selected?.id === tmpl.id ? 'ts-card--selected' : ''} ${hoveredId === tmpl.id ? 'ts-card--hovered' : ''}`}
                  onClick={() => setSelected(tmpl)}
                  onMouseEnter={() => setHoveredId(tmpl.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="ts-card-img-wrap">
                    <img src={tmpl.image} alt={tmpl.name} className="ts-card-img" />
                    <div className="ts-card-overlay">
                      <span className="ts-card-icon">{tmpl.icon}</span>
                    </div>
                    {selected?.id === tmpl.id && (
                      <div className="ts-selected-badge">✓ Selected</div>
                    )}
                    <div className="ts-count-badge">{tmpl.count} items</div>
                  </div>

                  {/* Info */}
                  <div className="ts-card-body">
                    <h3 className="ts-card-title">{tmpl.name}</h3>

                    {/* Category chips */}
                    <div className="ts-chips">
                      {tmpl.slots.map(slot => (
                        <span key={slot.category} className="ts-chip">
                          {getCategoryIcon(slot.category)} {slot.category}
                        </span>
                      ))}
                    </div>

                    {/* Product previews */}
                    {tmpl.furniture.length > 0 ? (
                      <div className="ts-products">
                        {tmpl.furniture.slice(0, 4).map((f, i) => (
                          <div key={i} className="ts-product-row">
                            <div className="ts-product-thumb">
                              {f.image && (f.image.startsWith('data:') || f.image.startsWith('http')) ? (
                                <img src={f.image} alt={f.name} />
                              ) : (
                                <span>{getCategoryIcon(f.category)}</span>
                              )}
                            </div>
                            <span className="ts-product-name">{f.name}</span>
                            <span className="ts-product-price">
                              Rs. {f.discount > 0
                                ? Math.round(f.price - f.price * f.discount / 100).toLocaleString()
                                : f.price?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {tmpl.furniture.length > 4 && (
                          <p className="ts-more">+{tmpl.furniture.length - 4} more items</p>
                        )}
                      </div>
                    ) : (
                      <p className="ts-empty">No products available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ts-footer">
          <button className="ts-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`ts-btn-apply ${!selected || selected.count === 0 ? 'ts-btn-apply--disabled' : ''}`}
            onClick={handleApply}
            disabled={!selected || selected.count === 0}
          >
            {selected ? `Apply "${selected.name}" Template` : 'Select a Template'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TemplateSelector;
