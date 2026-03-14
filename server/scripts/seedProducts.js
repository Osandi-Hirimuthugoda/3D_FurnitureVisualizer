const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: '2-Seater Sofa',
    category: 'sofas',
    price: 45000,
    discount: 10,
    dimensions: { length: 1.8, width: 0.9, height: 0.8 },
    description: 'Comfortable compact sofa perfect for small living rooms',
    image: '🛋️',
    inStock: true
  },
  {
    name: '3-Seater Sofa',
    category: 'sofas',
    price: 65000,
    discount: 15,
    dimensions: { length: 2.2, width: 0.9, height: 0.8 },
    description: 'Spacious sofa with premium cushioning',
    image: '🛋️',
    inStock: true
  },
  {
    name: 'L-Shape Sofa',
    category: 'sofas',
    price: 95000,
    discount: 20,
    dimensions: { length: 2.5, width: 2.0, height: 0.8 },
    description: 'Modern L-shaped sectional sofa',
    image: '🛋️',
    inStock: true
  },
  {
    name: 'Office Chair',
    category: 'chairs',
    price: 15000,
    discount: 5,
    dimensions: { length: 0.6, width: 0.6, height: 1.2 },
    description: 'Ergonomic office chair with lumbar support',
    image: '🪑',
    inStock: true
  },
  {
    name: 'Dining Chair',
    category: 'chairs',
    price: 8000,
    discount: 0,
    dimensions: { length: 0.5, width: 0.5, height: 0.9 },
    description: 'Classic wooden dining chair',
    image: '🪑',
    inStock: true
  },
  {
    name: 'Recliner Chair',
    category: 'chairs',
    price: 35000,
    discount: 10,
    dimensions: { length: 0.9, width: 0.9, height: 1.1 },
    description: 'Luxury recliner with footrest',
    image: '🪑',
    inStock: true
  },
  {
    name: 'Dining Table',
    category: 'tables',
    price: 55000,
    discount: 12,
    dimensions: { length: 1.8, width: 0.9, height: 0.75 },
    description: '6-seater dining table with solid wood',
    image: '🪑',
    inStock: true
  },
  {
    name: 'Coffee Table',
    category: 'tables',
    price: 18000,
    discount: 0,
    dimensions: { length: 1.2, width: 0.6, height: 0.45 },
    description: 'Modern glass-top coffee table',
    image: '🪑',
    inStock: true
  },
  {
    name: 'Study Table',
    category: 'tables',
    price: 25000,
    discount: 8,
    dimensions: { length: 1.2, width: 0.6, height: 0.75 },
    description: 'Compact study table with drawer',
    image: '🪑',
    inStock: true
  },
  {
    name: 'King Size Bed',
    category: 'beds',
    price: 85000,
    discount: 15,
    dimensions: { length: 2.0, width: 1.8, height: 1.2 },
    description: 'Luxurious king size bed with storage',
    image: '🛏️',
    inStock: true
  },
  {
    name: 'Queen Size Bed',
    category: 'beds',
    price: 65000,
    discount: 10,
    dimensions: { length: 2.0, width: 1.5, height: 1.2 },
    description: 'Comfortable queen size bed',
    image: '🛏️',
    inStock: true
  },
  {
    name: 'Single Bed',
    category: 'beds',
    price: 35000,
    discount: 5,
    dimensions: { length: 2.0, width: 0.9, height: 1.0 },
    description: 'Space-saving single bed',
    image: '🛏️',
    inStock: true
  },
  {
    name: 'Computer Desk',
    category: 'desks',
    price: 28000,
    discount: 10,
    dimensions: { length: 1.4, width: 0.7, height: 0.75 },
    description: 'Modern computer desk with cable management',
    image: '🖥️',
    inStock: true
  },
  {
    name: 'Executive Desk',
    category: 'desks',
    price: 55000,
    discount: 15,
    dimensions: { length: 1.8, width: 0.9, height: 0.75 },
    description: 'Premium executive desk with drawers',
    image: '🖥️',
    inStock: true
  },
  {
    name: 'Standing Desk',
    category: 'desks',
    price: 45000,
    discount: 8,
    dimensions: { length: 1.4, width: 0.7, height: 1.1 },
    description: 'Adjustable height standing desk',
    image: '🖥️',
    inStock: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products added successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
