import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Shared Pages
import RoomSetup from './pages/shared/RoomSetup';
import Appearance from './pages/shared/Appearance';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import Cart from './pages/customer/Cart';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/room-setup" element={<RoomSetup userRole="customer" />} />
          <Route path="/appearance" element={<Appearance userRole="customer" />} />
          <Route path="/portfolio" element={<Portfolio userRole="customer" />} />
          <Route path="/settings" element={<Settings userRole="customer" />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/room-setup" element={<RoomSetup userRole="admin" />} />
          <Route path="/admin/appearance" element={<Appearance userRole="admin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
