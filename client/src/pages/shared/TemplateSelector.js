import React, { useEffect, useState } from 'react';
import { templateLayouts } from './templateLayouts';
import './TemplateSelector.css';

const TemplateSelector = ({ roomShape, onApplyTemplate, onClose }) => {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // filter templates matching shape
    const list = templateLayouts.filter(t => t.shape === roomShape);
    setFiltered(list);
  }, [roomShape]);

  const handleApply = (template) => {
    onApplyTemplate(template);
    onClose();
  };

  return (
    <div className="template-selector-overlay">
      <div className="template-selector-modal">
        <div className="modal-header">
          <h2>Choose a Layout Template</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="template-list">
          {filtered.length === 0 ? (
            <p className="no-templates">No templates available for this room shape.</p>
          ) : (
            filtered.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-preview">📐</div>
                <h3 className="template-name">{template.name}</h3>
                <button
                  className="apply-btn"
                  onClick={() => handleApply(template)}
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
