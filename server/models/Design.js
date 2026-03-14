const mongoose = require('mongoose');

const canvasItemSchema = new mongoose.Schema({
  canvasId: { type: Number },
  id: { type: String },
  name: { type: String },
  size: String,
  type: String,
  image: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  price: Number,
  discount: Number,
  category: String,
  x: { type: Number, default: 1.5 },
  y: { type: Number, default: 2.0 },
  width: { type: Number, default: 2.0 },
  height: { type: Number, default: 1.0 },
  rotation: { type: Number, default: 0 }
}, { _id: false });

const designSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Design' },
  roomSpecs: {
    length: { type: Number, default: 5 },
    width: { type: Number, default: 4 },
    height: { type: Number, default: 3 },
    unit: { type: String, default: 'meters' },
    shape: { type: String, default: 'rectangle' },
    wallColor: { type: String, default: '#F5F5DC' },
    floorType: { type: String, default: 'hardwood' }
  },
  canvasItems: { type: [canvasItemSchema], default: [] },
  previewImage: { type: String, default: null },
  userId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

designSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Design', designSchema);
