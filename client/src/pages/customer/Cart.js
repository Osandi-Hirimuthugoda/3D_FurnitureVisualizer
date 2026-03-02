import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Cart = () => {
  return (
    <div>
      <Navbar userRole="customer" />
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <p>Your cart items will appear here</p>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
