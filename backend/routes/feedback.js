const router    = require('express').Router();
const Feedback  = require('../models/Feedback');
const Sentiment = require('sentiment');
const { sendAlert } = require('../utils/mailer');
const sentiment = new Sentiment();

// POST /api/feedback — submit feedback
router.post('/', async (req, res) => {
  const { tableId, dishId, dishName, category, comment, rating, deviceToken } = req.body;

  // Sentiment: star rating takes priority over text analysis
  let sentimentLabel;
  if (rating) {
    sentimentLabel = rating >= 4 ? 'Positive' : rating === 3 ? 'Neutral' : 'Negative';
  } else {
    const result = sentiment.analyze(comment || '');
    sentimentLabel = result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral';
  }

  const feedback = new Feedback({
    tableId, dishId, dishName, category, comment,
    rating:      rating ? Number(rating) : undefined,
    sentiment:   sentimentLabel,
    imageUrl:    req.file ? `/uploads/${req.file.filename}` : '',
    status:      'Open',
    deviceToken: deviceToken || '',
  });

  await feedback.save();

  // Alert if 3+ negative complaints for same dish+category today
  if (sentimentLabel === 'Negative') {
    const today = new Date(); today.setHours(0,0,0,0);
    const count = await Feedback.countDocuments({
      dishId, category, sentiment:'Negative', createdAt:{ $gte: today }
    });
    if (count >= 3) {
      try { await sendAlert(dishName, category, count); }
      catch(e) { console.error('Email alert failed:', e.message); }
    }
  }

  // ── Won-back customer detection ──────────────────────────────
  // If this submission is Positive, check if this device token
  // previously submitted a Negative review — if yes, customer was won back
  try {
    if (sentimentLabel === 'Positive' && deviceToken) {
      const WonBackEvent = require('../models/WonBackEvent');

      // Look for any previous negative feedback from same device
      const previousNegative = await Feedback.findOne({
        deviceToken,
        sentiment: 'Negative',
      }).sort({ createdAt: -1 }); // get most recent negative

      if (previousNegative) {
        // Same customer was unhappy before, now happy = WON BACK!
        await WonBackEvent.create({
          deviceToken,
          previousDish:   previousNegative.dishName,
          returnDish:     dishName,
          previousRating: previousNegative.rating || 1,
          returnRating:   Number(rating) || 5,
          previousDate:   previousNegative.createdAt,
        });
        console.log(`🎉 Won-back customer detected!`);
        console.log(`   Was unhappy about: ${previousNegative.dishName}`);
        console.log(`   Now happy about: ${dishName}`);
      }
    }
  } catch(e) {
    // Don't crash the feedback submission if won-back tracking fails
    console.error('Won-back tracking error:', e.message);
  }
  // ─────────────────────────────────────────────────────────────

  res.json({ message: 'Feedback submitted!', sentiment: sentimentLabel });
});

// GET /api/feedback — all feedback (admin)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/feedback/:id/status — update status (owner resolve/review)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Open', 'Under Review', 'Resolved'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updated);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
