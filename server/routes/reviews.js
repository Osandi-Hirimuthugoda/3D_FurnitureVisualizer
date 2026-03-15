const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// GET all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review (authenticated)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ error: 'Rating and comment required' });

    // One review per user
    const existing = await Review.findOne({ userId: req.user._id.toString() });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ success: true, review: existing });
    }

    const review = new Review({
      userId: req.user._id.toString(),
      userName: req.user.fullName || req.user.email,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
