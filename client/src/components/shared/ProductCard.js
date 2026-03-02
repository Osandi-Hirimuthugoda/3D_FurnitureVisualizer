import React from 'react';

const ProductCard = ({ product, onView, onEdit, isAdmin }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">Rs. {product.price}</p>
      <div className="card-actions">
        <button onClick={() => onView(product)}>View 3D</button>
        {isAdmin && (
          <button onClick={() => onEdit(product)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
