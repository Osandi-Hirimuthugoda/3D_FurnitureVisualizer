const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sortBy, inStock } = req.query;
    
    // Build query
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }
    
    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'name':
        sort.name = 1;
        break;
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'discount':
        sort.discount = -1;
        break;
      default:
        sort.createdAt = -1;
    }
    
    const products = await Product.find(query).sort(sort);
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, discount, dimensions, description, image, inStock } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !dimensions) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Validate dimensions
    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      return res.status(400).json({ message: 'Please provide all dimensions' });
    }
    
    const product = new Product({
      name,
      category,
      price,
      discount: discount || 0,
      dimensions,
      description,
      image: image || '🪑',
      inStock: inStock !== undefined ? inStock : true,
      createdBy: req.user.id
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, discount, dimensions, description, image, inStock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (dimensions) product.dimensions = dimensions;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (inStock !== undefined) product.inStock = inStock;
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.find({ category, inStock: true }).sort({ name: 1 });
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};
