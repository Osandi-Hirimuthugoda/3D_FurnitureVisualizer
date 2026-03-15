const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const { protect } = require('../middleware/auth');

// Create a new design (from Room Setup)
router.post('/', protect, async (req, res) => {
  try {
    const { roomSpecs, title } = req.body;
    const design = new Design({
      title: title || 'Untitled Design',
      roomSpecs: roomSpecs || {},
      canvasItems: [],
      userId: (req.user._id || req.user.id).toString()
    });
    await design.save();
    res.status(201).json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user's designs
router.get('/my-designs', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;
    // Match by ObjectId OR by email (legacy designs stored email as userId)
    const designs = await Design.find({
      $or: [
        { userId: userId.toString() },
        { userId: userEmail }
      ]
    }).sort({ updatedAt: -1 });
    res.json({ success: true, designs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all designs for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get design by ID
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update design (room specs and/or canvas items)
router.put('/:id', async (req, res) => {
  try {
    const { roomSpecs, canvasItems, title, previewImage } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

    if (title !== undefined) design.title = title;
    if (roomSpecs) design.roomSpecs = { ...(design.roomSpecs?.toObject ? design.roomSpecs.toObject() : design.roomSpecs), ...roomSpecs };
    if (canvasItems !== undefined) design.canvasItems = canvasItems;
    if (previewImage !== undefined) design.previewImage = previewImage;

    await design.save();
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete design
router.delete('/:id', protect, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    if (design.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Design.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Design deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rasterization API: render 3D scene and return PNG image
router.post('/:id/rasterize', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

    let rasterizeDesign;
    try {
      rasterizeDesign = require('../services/rasterizeService').rasterizeDesign;
    } catch (e) {
      return res.status(503).json({ error: 'Rasterization service unavailable (puppeteer not installed)' });
    }

    const { camera = 'perspective', lighting = 'day', shadows = true } = req.body;
    const imageBuffer = await rasterizeDesign(design, { camera, lighting, shadows });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', imageBuffer.length);
    res.end(imageBuffer);
  } catch (err) {
    console.error('Rasterization error:', err);
    res.status(500).json({ error: err.message || 'Rasterization failed' });
  }
});

module.exports = router;
