const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const { rasterizeDesign } = require('../services/rasterizeService');

// Create a new design (from Room Setup)
router.post('/', async (req, res) => {
  try {
    const { roomSpecs, userId } = req.body;
    const design = new Design({
      roomSpecs: roomSpecs || {},
      canvasItems: [],
      userId: userId || null
    });
    await design.save();
    res.status(201).json(design);
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
    const { roomSpecs, canvasItems } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

    if (roomSpecs) design.roomSpecs = { ...design.roomSpecs.toObject(), ...roomSpecs };
    if (canvasItems !== undefined) design.canvasItems = canvasItems;

    await design.save();
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rasterization API: render 3D scene and return PNG image
router.post('/:id/rasterize', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });

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
