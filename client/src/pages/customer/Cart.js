import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/admin/Sidebar';
import Footer from '../../components/shared/Footer';
import './Cart.css';

const Cart = () => {
  const userRole = localStorage.getItem('userRole');
  
  return (
    <div className="cart-page">
      <Navbar userRole={userRole} />
      <Sidebar />
      <div className="cart-container with-sidebar">
        <h1>Shopping Cart</h1>
        <p>Your cart items will appear here</p>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
