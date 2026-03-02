import React, { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import ProductCard from '../../components/shared/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);

  const handleViewProduct = (product) => {
    // Navigate to 3D viewer
    console.log('View product:', product);
  };

  return (
    <div>
      <Navbar userRole="customer" />
      <div className="products-container">
        <h1>Our Products</h1>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product._id}
              product={product}
              onView={handleViewProduct}
              isAdmin={false}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
