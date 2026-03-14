import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import './ManageProducts.css';

const ManageProducts = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'sofas',
    price: '',
    discount: 0,
    dimensions: { length: '', width: '', height: '' },
    description: '',
    image: '',
    inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result // Base64 encoded image
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        dimensions: {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height)
        },
        description: formData.description,
        image: formData.image || '🪑',
        inStock: formData.inStock
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await createProduct(productData);
        alert('Product created successfully!');
      }
      
      // Refresh products list
      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setImagePreview(product.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteProduct(id);
        alert('Product deleted successfully!');
        await fetchProducts();
      } catch (err) {
        setError(err.message);
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'sofas',
      price: '',
      discount: 0,
      dimensions: { length: '', width: '', height: '' },
      description: '',
      image: '',
      inStock: true
    });
    setImagePreview('');
    setEditingProduct(null);
    setShowModal(false);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  return (
    <div className="manage-products-page">
      <Navbar userRole="admin" />
      
      <div className="manage-products-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1>Manage Products</h1>
          <button className="btn-add-product" onClick={() => setShowModal(true)}>
            ➕ Add New Product
          </button>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  product.image.startsWith('data:image') || product.image.startsWith('http') ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span className="emoji-image">{product.image}</span>
                  )
                ) : (
                  <span className="emoji-image">🪑</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-dimensions">
                  {product.dimensions.length}m × {product.dimensions.width}m × {product.dimensions.height}m
                </p>
                <p className="product-description">{product.description}</p>
                
                <div className="product-pricing">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">Rs. {product.price.toLocaleString()}</span>
                      <span className="discounted-price">
                        Rs. {calculateDiscountedPrice(product.price, product.discount).toLocaleString()}
                      </span>
                      <span className="discount-badge">{product.discount}% OFF</span>
                    </>
                  ) : (
                    <span className="price">Rs. {product.price.toLocaleString()}</span>
                  )}
                </div>

                <div className="product-status">
                  <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>

                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <p>No products yet. Add your first product!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2-Seater Sofa"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="sofas">Sofas</option>
                    <option value="chairs">Chairs</option>
                    <option value="tables">Tables</option>
                    <option value="beds">Beds</option>
                    <option value="desks">Desks</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="45000"
                  />
                </div>

                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Dimensions (meters)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Length *</label>
                    <input
                      type="number"
                      name="dimensions.length"
                      value={formData.dimensions.length}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      min="0"
                      placeholder="1.8"
                    />
                  </div>

                  <div className="form-group">
                    <label>Width *</label>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      min="0"
                      placeholder="0.9"
                    />
                  </div>

                  <div className="form-group">
                    <label>Height *</label>
                    <input
                      type="number"
                      name="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      min="0"
                      placeholder="0.8"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the product"
                />
              </div>

              <div className="form-group">
                <label>Product Image *</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        {imagePreview.startsWith('data:image') || imagePreview.startsWith('http') ? (
                          <img src={imagePreview} alt="Preview" />
                        ) : (
                          <span className="emoji-preview">{imagePreview}</span>
                        )}
                        <div className="preview-overlay">
                          <span>Click to change image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <p>Click to upload image</p>
                        <p className="upload-hint">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="form-hint">Or use emoji (e.g., 🪑 🛋️ 🛏️)</p>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="🛋️ or leave empty to use uploaded image"
                  className="emoji-input"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageProducts;
