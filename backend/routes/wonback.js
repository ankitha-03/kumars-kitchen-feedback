const router = require('express').Router();
const WonBackEvent = require('../models/WonBackEvent');

// GET /api/wonback — returns all won-back events, newest first
router.get('/', async (req, res) => {
  try {
    const events = await WonBackEvent.find()
                                     .sort({ createdAt: -1 });
    res.json(events);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/wonback/count — returns just the total count
router.get('/count', async (req, res) => {
  try {
    const count = await WonBackEvent.countDocuments();
    res.json({ count });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
