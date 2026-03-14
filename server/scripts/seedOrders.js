const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const seedOrders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Get a customer user (create one if doesn't exist)
    let customer = await User.findOne({ role: 'customer' });
    
    if (!customer) {
      customer = new User({
        fullName: 'Test Customer',
        email: 'customer@test.com',
        password: 'Customer@123',
        role: 'customer'
      });
      await customer.save();
      console.log('Test customer created');
    }

    // Get some products
    const products = await Product.find().limit(5);
    
    if (products.length === 0) {
      console.log('No products found. Please run seed:products first');
      process.exit(1);
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Existing orders cleared');
    
    // Drop the orderNumber index if it exists
    try {
      await Order.collection.dropIndex('orderNumber_1');
      console.log('Dropped orderNumber index');
    } catch (err) {
      // Index might not exist, that's okay
    }

    // Create sample orders
    const sampleOrders = [
      {
        customer: customer._id,
        customerName: 'Kasun Perera',
        customerEmail: 'kasun@example.com',
        customerPhone: '0771234567',
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            quantity: 1,
            price: products[0].price,
            image: products[0].image
          },
          {
            product: products[1]._id,
            name: products[1].name,
            quantity: 1,
            price: products[1].price,
            image: products[1].image
          }
        ],
        totalAmount: products[0].price + products[1].price,
        shippingAddress: 'No. 123, Galle Road, Colombo 03',
        status: 'pending'
      },
      {
        customer: customer._id,
        customerName: 'Nimal Silva',
        customerEmail: 'nimal@example.com',
        customerPhone: '0779876543',
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            quantity: 2,
            price: products[2].price,
            image: products[2].image
          }
        ],
        totalAmount: products[2].price * 2,
        shippingAddress: 'No. 45, Kandy Road, Peradeniya',
        status: 'processing'
      },
      {
        customer: customer._id,
        customerName: 'Amara Fernando',
        customerEmail: 'amara@example.com',
        customerPhone: '0765432109',
        items: [
          {
            product: products[3]._id,
            name: products[3].name,
            quantity: 1,
            price: products[3].price,
            image: products[3].image
          }
        ],
        totalAmount: products[3].price,
        shippingAddress: 'No. 78, Main Street, Gampaha',
        status: 'shipped'
      },
      {
        customer: customer._id,
        customerName: 'Saman Kumara',
        customerEmail: 'saman@example.com',
        customerPhone: '0712345678',
        items: [
          {
            product: products[4]._id,
            name: products[4].name,
            quantity: 1,
            price: products[4].price,
            image: products[4].image
          }
        ],
        totalAmount: products[4].price,
        shippingAddress: 'No. 234, Temple Road, Negombo',
        status: 'delivered'
      }
    ];

    // Insert orders
    await Order.insertMany(sampleOrders);
    console.log(`${sampleOrders.length} orders added successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
