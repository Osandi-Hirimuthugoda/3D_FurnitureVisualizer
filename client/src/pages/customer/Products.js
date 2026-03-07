import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/admin/Sidebar';
import Footer from '../../components/shared/Footer';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('furnitureProducts');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'discount':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, products]);

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: '🏠' },
    { id: 'sofas', name: 'Sofas', icon: '🛋️' },
    { id: 'chairs', name: 'Chairs', icon: '🪑' },
    { id: 'tables', name: 'Tables', icon: '🪑' },
    { id: 'beds', name: 'Beds', icon: '🛏️' },
    { id: 'desks', name: 'Desks', icon: '🖥️' }
  ];

  return (
    <div className="products-page">
      <Navbar userRole={userRole} />
      <Sidebar />
      
      <div className="products-container with-sidebar">
        <div className="products-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Our Furniture Collection</h1>
          <p className="subtitle">Browse our wide selection of quality furniture</p>
        </div>

        <div className="products-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          <aside className="categories-sidebar">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="category-count">
                    ({category.id === 'all'
                      ? products.length
                      : products.filter(p => p.category === category.id).length})
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <main className="products-grid-container">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product._id} className="product-card">
                    {product.discount > 0 && (
                      <div className="discount-badge">{product.discount}% OFF</div>
                    )}
                    {!product.inStock && (
                      <div className="out-of-stock-overlay">Out of Stock</div>
                    )}

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

                    <div className="product-details">
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
                          </>
                        ) : (
                          <span className="price">Rs. {product.price.toLocaleString()}</span>
                        )}
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No products found</p>
                <p className="empty-hint">Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
