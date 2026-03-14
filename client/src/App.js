import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Shared Pages
import RoomSetup from './pages/shared/RoomSetup';
import Dashboard from './pages/shared/Dashboard';
import LayoutEditor from './pages/shared/LayoutEditor';
import ThreeDView from './pages/shared/ThreeDView';
import Appearance from './pages/shared/Appearance';
import Portfolio from './pages/shared/Portfolio';
import Settings from './pages/shared/Settings';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import Cart from './pages/customer/Cart';

// Admin Pages
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Both Admin & Customer */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/room-setup" element={
            <ProtectedRoute>
              <RoomSetup />
            </ProtectedRoute>
          } />
          <Route path="/room-layout" element={
            <ProtectedRoute>
              <LayoutEditor />
            </ProtectedRoute>
          } />
          <Route path="/room-3d" element={
            <ProtectedRoute>
              <ThreeDView />
            </ProtectedRoute>
          } />
          <Route path="/appearance" element={
            <ProtectedRoute>
              <Appearance />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Admin Only Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly={true}>
              <ManageProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly={true}>
              <ManageOrders />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;