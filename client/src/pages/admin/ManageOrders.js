import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const ManageOrders = () => {
  return (
    <div>
      <Navbar userRole="admin" />
      <div className="manage-orders-container">
        <h1>Manage Orders</h1>
        <p>Order management interface</p>
      </div>
      <Footer />
    </div>
  );
};

export default ManageOrders;
