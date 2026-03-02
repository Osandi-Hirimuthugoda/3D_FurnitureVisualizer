import React, { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import ProductCard from '../../components/shared/ProductCard';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const handleViewProduct = (product) => {
    console.log('View product:', product);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
  };

  return (
    <div>
      <Navbar userRole="admin" />
      <div className="manage-products-container">
        <div className="header">
          <h1>Manage Products</h1>
          <button className="btn-add">Add New Product</button>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product._id}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              isAdmin={true}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageProducts;
