import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  // Menu items based on user role
  const adminMenuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/room-setup', icon: '🏠', label: 'Room Setup' },
    { path: '/room-layout', icon: '📐', label: '2D Layout' },
    { path: '/products', icon: '🛋️', label: 'Browse Products' },
    { path: '/admin/products', icon: '🪑', label: 'Manage Products' },
    { path: '/admin/orders', icon: '📦', label: 'Manage Orders' },
  ];

  const customerMenuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/room-setup', icon: '🏠', label: 'Room Setup' },
    { path: '/room-layout', icon: '📐', label: '2D Layout' },
    { path: '/products', icon: '🛋️', label: 'Browse Products' },
    { path: '/cart', icon: '🛒', label: 'My Cart' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : customerMenuItems;
  const panelTitle = userRole === 'admin' ? 'Admin Panel' : 'Menu';
  const panelIcon = userRole === 'admin' ? '🛠️' : '🎨';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      <div className="sidebar-header">
        <span className="sidebar-icon">{panelIcon}</span>
        {!isCollapsed && <h2>{panelTitle}</h2>}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                title={item.label}
              >
                <span className="menu-icon">{item.icon}</span>
                {!isCollapsed && <span className="menu-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="back-to-site">
          <span className="menu-icon">🏠</span>
          {!isCollapsed && <span>Back to Home</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
